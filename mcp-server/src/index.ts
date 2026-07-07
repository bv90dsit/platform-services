import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cataloguePath = join(__dirname, "../../services.json");
const catalogue = JSON.parse(readFileSync(cataloguePath, "utf-8"));

interface Service {
  id: string;
  name: string;
  description: string;
  status: string;
  provisioning_time: string;
  guardrails: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

const server = new McpServer({
  name: "platform-services",
  version: "1.0.0",
});

server.tool(
  "list_services",
  "List all available platform services, optionally filtered by category",
  { category: z.string().optional().describe("Filter by category: networking, compute, storage, security") },
  async ({ category }) => {
    let categories: Category[] = catalogue.categories;

    if (category) {
      categories = categories.filter(
        (c: Category) => c.id === category || c.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (categories.length === 0) {
      return {
        content: [{ type: "text" as const, text: `No category found matching "${category}". Available categories: networking, compute, storage, security` }],
      };
    }

    const output = categories.map((cat: Category) => {
      const services = cat.services.map(
        (s: Service) => `  - ${s.name}: ${s.description} [${s.status}] (~${s.provisioning_time})`
      );
      return `${cat.name}\n${cat.description}\n${services.join("\n")}`;
    });

    return {
      content: [{ type: "text" as const, text: output.join("\n\n") }],
    };
  }
);

server.tool(
  "get_service_details",
  "Get detailed information about a specific service including guardrails and provisioning time",
  { service_id: z.string().describe("Service ID (e.g. 'vpc', 'eks', 's3', 'lambda', 'waf')") },
  async ({ service_id }) => {
    for (const cat of catalogue.categories) {
      const service = cat.services.find(
        (s: Service) => s.id === service_id || s.name.toLowerCase() === service_id.toLowerCase()
      );
      if (service) {
        const guardrails = service.guardrails.length > 0
          ? service.guardrails.map((g: string) => `  - ${g}`).join("\n")
          : "  None specified";

        const text = [
          `Service: ${service.name}`,
          `Category: ${cat.name}`,
          `Description: ${service.description}`,
          `Status: ${service.status}`,
          `Provisioning time: ${service.provisioning_time}`,
          ``,
          `Guardrails:`,
          guardrails,
          ``,
          `To request this service: ${catalogue.request_urls.feature_request}`,
        ].join("\n");

        return { content: [{ type: "text" as const, text }] };
      }
    }

    const allIds = catalogue.categories.flatMap((c: Category) => c.services.map((s: Service) => s.id));
    return {
      content: [{ type: "text" as const, text: `Service "${service_id}" not found. Available services: ${allIds.join(", ")}` }],
    };
  }
);

server.tool(
  "get_guardrails",
  "List all guardrails and constraints across platform services, optionally filtered by category",
  { category: z.string().optional().describe("Filter by category: networking, compute, storage, security") },
  async ({ category }) => {
    let categories: Category[] = catalogue.categories;

    if (category) {
      categories = categories.filter(
        (c: Category) => c.id === category || c.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    const output = categories.map((cat: Category) => {
      const guardrails = cat.services
        .filter((s: Service) => s.guardrails.length > 0)
        .map((s: Service) => s.guardrails.map((g: string) => `  - [${s.name}] ${g}`).join("\n"));
      return `${cat.name}:\n${guardrails.join("\n")}`;
    });

    return {
      content: [{ type: "text" as const, text: output.join("\n\n") }],
    };
  }
);

server.tool(
  "how_to_request",
  "Get information on how to request a service or ask a question",
  { type: z.enum(["service", "question"]).describe("Type of request: 'service' for a new service/feature, 'question' to ask the team") },
  async ({ type }) => {
    if (type === "service") {
      return {
        content: [{
          type: "text" as const,
          text: [
            "To request a new service or feature:",
            `1. Open: ${catalogue.request_urls.feature_request}`,
            "2. Select the request type and service area",
            "3. Describe what you need and why",
            "4. Set a priority level",
            "",
            "The platform team reviews requests weekly.",
          ].join("\n"),
        }],
      };
    }

    return {
      content: [{
        type: "text" as const,
        text: [
          "To ask the platform team a question:",
          `1. Open: ${catalogue.request_urls.question}`,
          "2. Select the relevant service area",
          "3. Describe your question with context",
          "",
          `You can also reach the team on Slack: ${catalogue.team.slack_channel}`,
          `Office hours: ${catalogue.team.office_hours}`,
        ].join("\n"),
      }],
    };
  }
);

server.tool(
  "get_team_contacts",
  "Get platform team contact information",
  {},
  async () => {
    const contacts = catalogue.team.contacts.map(
      (c: { name: string; role: string; email: string }) => `  - ${c.name} (${c.role}): ${c.email}`
    );

    const text = [
      `Team: ${catalogue.team.name}`,
      `Slack: ${catalogue.team.slack_channel}`,
      `Office hours: ${catalogue.team.office_hours}`,
      ``,
      `Contacts:`,
      ...contacts,
    ].join("\n");

    return { content: [{ type: "text" as const, text }] };
  }
);

server.tool(
  "request_service",
  "Submit a request to provision an existing platform service (creates a GitHub Issue matching the feature-request form)",
  {
    service_id: z.string().describe("Service ID to request (e.g. 's3', 'vpc', 'eks')"),
    description: z.string().describe("What you need and why — e.g. 'S3 bucket for storing PDF receipts, needs versioning enabled'"),
    priority: z.enum(["low", "medium", "high"]).describe("Priority: low (no deadline), medium (next few weeks), high (blocking current work)"),
    alternatives: z.string().optional().describe("Any workarounds or alternatives you've considered"),
  },
  async ({ service_id, description, priority, alternatives }) => {
    let service: Service | undefined;
    let category: Category | undefined;

    for (const cat of catalogue.categories) {
      const found = cat.services.find(
        (s: Service) => s.id === service_id || s.name.toLowerCase() === service_id.toLowerCase()
      );
      if (found) {
        service = found;
        category = cat;
        break;
      }
    }

    if (!service || !category) {
      const allIds = catalogue.categories.flatMap((c: Category) => c.services.map((s: Service) => s.id));
      return {
        content: [{ type: "text" as const, text: `Service "${service_id}" not found. Available: ${allIds.join(", ")}` }],
      };
    }

    if (service.status !== "available") {
      return {
        content: [{ type: "text" as const, text: `Service "${service.name}" is not currently available (status: ${service.status}).` }],
      };
    }

    const priorityLabels: Record<string, string> = {
      low: "Low — nice to have, no deadline",
      medium: "Medium — needed in the next few weeks",
      high: "High — blocking current work",
    };

    const serviceAreaMap: Record<string, string> = {
      networking: "Networking",
      compute: "Compute",
      storage: "Storage & Data",
      security: "Security",
    };

    const issueTitle = `[Request]: ${service.name} provisioning`;
    const issueBody = [
      `### Request type`,
      ``,
      `Enhancement to an existing service`,
      ``,
      `### Service area`,
      ``,
      serviceAreaMap[category.id] || "General / Other",
      ``,
      `### Description`,
      ``,
      description,
      ``,
      `### Priority`,
      ``,
      priorityLabels[priority],
      ``,
      `### Alternatives considered`,
      ``,
      alternatives || "_No response_",
    ].join("\n");

    try {
      const result = execSync(
        `gh issue create --repo bv90dsit/platform-services --title "${issueTitle.replace(/"/g, '\\"')}" --label "enhancement" --body "${issueBody.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`,
        { encoding: "utf-8", timeout: 15000 }
      ).trim();

      return {
        content: [{
          type: "text" as const,
          text: [
            `Request submitted successfully.`,
            ``,
            `Issue: ${result}`,
            `Service: ${service.name}`,
            `Expected provisioning time: ${service.provisioning_time}`,
            ``,
            `The platform team will review your request. You'll be notified on the issue when it's actioned.`,
          ].join("\n"),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: [
            `Failed to create issue. Ensure the 'gh' CLI is authenticated.`,
            ``,
            `You can manually submit here: ${catalogue.request_urls.feature_request}`,
            ``,
            `Details for your request:`,
            `- Service: ${service.name}`,
            `- Description: ${description}`,
            `- Priority: ${priorityLabels[priority]}`,
          ].join("\n"),
        }],
      };
    }
  }
);

server.tool(
  "request_new_service",
  "Request a service that doesn't exist in the catalogue yet (creates a GitHub Issue matching the feature-request form with 'New service' type)",
  {
    service_name: z.string().describe("Name of the service you're requesting (e.g. 'ElastiCache', 'Step Functions')"),
    service_area: z.enum(["Networking", "Compute", "Storage & Data", "Security", "CI/CD & Tooling", "General / Other"]).describe("Which area this relates to"),
    description: z.string().describe("What you need, why you need it, and the problem it solves for your team"),
    priority: z.enum(["low", "medium", "high"]).describe("Priority: low (no deadline), medium (next few weeks), high (blocking current work)"),
    alternatives: z.string().optional().describe("Workarounds or alternatives you've considered"),
  },
  async ({ service_name, service_area, description, priority, alternatives }) => {
    const priorityLabels: Record<string, string> = {
      low: "Low — nice to have, no deadline",
      medium: "Medium — needed in the next few weeks",
      high: "High — blocking current work",
    };

    const issueTitle = `[Request]: ${service_name} (new service)`;
    const issueBody = [
      `### Request type`,
      ``,
      `New service (something not currently offered)`,
      ``,
      `### Service area`,
      ``,
      service_area,
      ``,
      `### Description`,
      ``,
      description,
      ``,
      `### Priority`,
      ``,
      priorityLabels[priority],
      ``,
      `### Alternatives considered`,
      ``,
      alternatives || "_No response_",
    ].join("\n");

    try {
      const result = execSync(
        `gh issue create --repo bv90dsit/platform-services --title "${issueTitle.replace(/"/g, '\\"')}" --label "new-service-proposal" --body "${issueBody.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`,
        { encoding: "utf-8", timeout: 15000 }
      ).trim();

      return {
        content: [{
          type: "text" as const,
          text: [
            `New service request submitted.`,
            ``,
            `Issue: ${result}`,
            `Service: ${service_name}`,
            `Area: ${service_area}`,
            ``,
            `New service requests go through architecture review before approval.`,
            `The platform team will assess feasibility and update the issue with a decision.`,
          ].join("\n"),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: [
            `Failed to create issue. Ensure the 'gh' CLI is authenticated.`,
            ``,
            `You can manually submit here: ${catalogue.request_urls.feature_request}`,
            ``,
            `Details for your request:`,
            `- Service: ${service_name}`,
            `- Area: ${service_area}`,
            `- Description: ${description}`,
            `- Priority: ${priorityLabels[priority]}`,
          ].join("\n"),
        }],
      };
    }
  }
);

server.tool(
  "check_service_compatibility",
  "Check if a service request is compatible with platform guardrails and suggest configuration",
  {
    service_id: z.string().describe("Service ID to check (e.g. 's3', 'rds', 'ec2')"),
    requirements: z.string().describe("Describe what you need — e.g. 'public-facing bucket for static website hosting'"),
  },
  async ({ service_id, requirements }) => {
    let service: Service | undefined;
    let category: Category | undefined;

    for (const cat of catalogue.categories) {
      const found = cat.services.find(
        (s: Service) => s.id === service_id || s.name.toLowerCase() === service_id.toLowerCase()
      );
      if (found) {
        service = found;
        category = cat;
        break;
      }
    }

    if (!service || !category) {
      const allIds = catalogue.categories.flatMap((c: Category) => c.services.map((s: Service) => s.id));
      return {
        content: [{ type: "text" as const, text: `Service "${service_id}" not found. Available: ${allIds.join(", ")}` }],
      };
    }

    const guardrails = service.guardrails;
    const requirementsLower = requirements.toLowerCase();

    const conflicts: string[] = [];
    const notes: string[] = [];

    if (service.id === "s3") {
      if (requirementsLower.includes("public")) {
        const rule = guardrails.find(g => g.toLowerCase().includes("private by default"));
        if (rule) {
          conflicts.push(`Your request mentions public access, but: "${rule}". You'll need to discuss this with the platform team — consider using CloudFront in front of a private bucket instead.`);
        }
      }
      notes.push("Encryption at rest is enabled by default (SSE-S3)");
      notes.push("Bucket policies are scoped to your team's IAM roles");
    }

    if (service.id === "rds") {
      if (requirementsLower.includes("public") || requirementsLower.includes("internet")) {
        const rule = guardrails.find(g => g.toLowerCase().includes("private subnet"));
        if (rule) {
          conflicts.push(`Your request mentions public/internet access, but: "${rule}". Databases are never directly exposed to the internet.`);
        }
      }
      notes.push("Credentials will be stored in Secrets Manager and rotated automatically");
      notes.push("Automated backups are configured based on environment tier");
    }

    if (service.id === "ec2") {
      if (requirementsLower.includes("custom ami") || requirementsLower.includes("own ami")) {
        const rule = guardrails.find(g => g.toLowerCase().includes("approved ami"));
        if (rule) {
          conflicts.push(`Your request mentions a custom AMI, but: "${rule}". Raise a request to have your AMI added to the approved list.`);
        }
      }
    }

    if (guardrails.length > 0 && conflicts.length === 0) {
      notes.push("No conflicts detected with current guardrails");
    }

    const text = [
      `Compatibility check: ${service.name}`,
      ``,
      `Your requirements: ${requirements}`,
      ``,
      conflicts.length > 0 ? `⚠ Potential conflicts:` : `✓ No guardrail conflicts detected`,
      ...conflicts.map(c => `  - ${c}`),
      ``,
      `Notes:`,
      ...notes.map(n => `  - ${n}`),
      ``,
      `Guardrails for ${service.name}:`,
      ...(guardrails.length > 0 ? guardrails.map(g => `  - ${g}`) : ["  None specified"]),
      ``,
      `Ready to proceed? Use the 'request_service' tool to submit your request.`,
    ].join("\n");

    return { content: [{ type: "text" as const, text }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
