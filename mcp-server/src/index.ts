import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
