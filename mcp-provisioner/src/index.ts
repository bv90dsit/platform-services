import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const statePath = join(__dirname, "../provisioner-state.json");

interface Resource {
  id: string;
  service_id: string;
  team: string;
  environment: string;
  config: Record<string, string>;
  status: "provisioning" | "active" | "failed";
  arn: string;
  endpoint?: string;
  created_at: string;
}

function loadState(): Resource[] {
  if (!existsSync(statePath)) return [];
  return JSON.parse(readFileSync(statePath, "utf-8"));
}

function saveState(resources: Resource[]): void {
  writeFileSync(statePath, JSON.stringify(resources, null, 2));
}

function generateArn(service_id: string, team: string, environment: string): string {
  const region = "eu-west-2";
  const account = "123456789012";
  const arnMap: Record<string, string> = {
    s3: `arn:aws:s3:::${team}-${environment}-${randomUUID().slice(0, 8)}`,
    rds: `arn:aws:rds:${region}:${account}:db:${team}-${environment}`,
    dynamodb: `arn:aws:dynamodb:${region}:${account}:table/${team}-${environment}`,
    efs: `arn:aws:elasticfilesystem:${region}:${account}:file-system/fs-${randomUUID().slice(0, 8)}`,
    vpc: `arn:aws:ec2:${region}:${account}:vpc/vpc-${randomUUID().slice(0, 8)}`,
    eks: `arn:aws:eks:${region}:${account}:cluster/${team}-${environment}`,
    "ecs-fargate": `arn:aws:ecs:${region}:${account}:cluster/${team}-${environment}`,
    lambda: `arn:aws:lambda:${region}:${account}:function:${team}-${environment}`,
    ec2: `arn:aws:ec2:${region}:${account}:instance/i-${randomUUID().slice(0, 12)}`,
    iam: `arn:aws:iam::${account}:role/${team}-${environment}-role`,
    waf: `arn:aws:wafv2:${region}:${account}:regional/webacl/${team}-${environment}`,
    "secrets-manager": `arn:aws:secretsmanager:${region}:${account}:secret:${team}/${environment}`,
    "transit-gateway": `arn:aws:ec2:${region}:${account}:transit-gateway/tgw-${randomUUID().slice(0, 8)}`,
    route53: `arn:aws:route53:::hostedzone/Z${randomUUID().slice(0, 10).toUpperCase()}`,
    cloudfront: `arn:aws:cloudfront::${account}:distribution/E${randomUUID().slice(0, 10).toUpperCase()}`,
    guardduty: `arn:aws:guardduty:${region}:${account}:detector/${randomUUID().slice(0, 12)}`,
  };
  return arnMap[service_id] || `arn:aws:${service_id}:${region}:${account}:${team}-${environment}`;
}

function generateEndpoint(service_id: string, team: string, environment: string): string | undefined {
  const endpointMap: Record<string, string> = {
    s3: `https://${team}-${environment}.s3.eu-west-2.amazonaws.com`,
    rds: `${team}-${environment}.cluster-abc123.eu-west-2.rds.amazonaws.com:5432`,
    eks: `https://${team}-${environment}.eks.eu-west-2.amazonaws.com`,
    cloudfront: `https://d${randomUUID().slice(0, 12)}.cloudfront.net`,
  };
  return endpointMap[service_id];
}

const server = new McpServer({
  name: "platform-provisioner",
  version: "1.0.0",
});

server.tool(
  "provision_resource",
  "Provision an AWS resource for a team. Returns the resource ARN and endpoint once provisioned.",
  {
    service_id: z.string().describe("Service to provision (e.g. 's3', 'rds', 'eks', 'vpc')"),
    team: z.string().describe("Team name that will own this resource"),
    environment: z.enum(["dev", "staging", "production"]).describe("Target environment"),
    config: z.record(z.string(), z.string()).optional().describe("Optional configuration (e.g. {\"versioning\": \"enabled\", \"engine\": \"postgres\"})"),
  },
  async ({ service_id, team, environment, config }) => {
    const resources = loadState();

    const resource: Resource = {
      id: randomUUID(),
      service_id,
      team,
      environment,
      config: config || {},
      status: "active",
      arn: generateArn(service_id, team, environment),
      endpoint: generateEndpoint(service_id, team, environment),
      created_at: new Date().toISOString(),
    };

    resources.push(resource);
    saveState(resources);

    const lines = [
      `Resource provisioned successfully.`,
      ``,
      `ID: ${resource.id}`,
      `Service: ${service_id}`,
      `Team: ${team}`,
      `Environment: ${environment}`,
      `Status: ${resource.status}`,
      `ARN: ${resource.arn}`,
    ];

    if (resource.endpoint) {
      lines.push(`Endpoint: ${resource.endpoint}`);
    }

    if (config && Object.keys(config).length > 0) {
      lines.push(``, `Configuration:`);
      for (const [key, value] of Object.entries(config)) {
        lines.push(`  ${key}: ${value}`);
      }
    }

    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

server.tool(
  "get_provisioning_status",
  "Check the status of a provisioned resource by ID",
  { resource_id: z.string().describe("Resource ID returned from provision_resource") },
  async ({ resource_id }) => {
    const resources = loadState();
    const resource = resources.find(r => r.id === resource_id);

    if (!resource) {
      return {
        content: [{ type: "text" as const, text: `Resource "${resource_id}" not found.` }],
      };
    }

    const lines = [
      `Resource: ${resource.service_id}`,
      `Team: ${resource.team}`,
      `Environment: ${resource.environment}`,
      `Status: ${resource.status}`,
      `ARN: ${resource.arn}`,
      resource.endpoint ? `Endpoint: ${resource.endpoint}` : null,
      `Created: ${resource.created_at}`,
    ].filter(Boolean);

    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

server.tool(
  "list_team_resources",
  "List all resources provisioned for a team, optionally filtered by environment",
  {
    team: z.string().describe("Team name"),
    environment: z.string().optional().describe("Filter by environment (dev, staging, production)"),
  },
  async ({ team, environment }) => {
    let resources = loadState().filter(r => r.team === team);

    if (environment) {
      resources = resources.filter(r => r.environment === environment);
    }

    if (resources.length === 0) {
      return {
        content: [{ type: "text" as const, text: `No resources found for team "${team}"${environment ? ` in ${environment}` : ""}.` }],
      };
    }

    const lines = resources.map(r =>
      `- ${r.service_id} (${r.environment}) [${r.status}] — ${r.arn}`
    );

    return {
      content: [{ type: "text" as const, text: `Resources for ${team}:\n\n${lines.join("\n")}` }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
