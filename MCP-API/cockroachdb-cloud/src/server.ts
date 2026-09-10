import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { loadConfig, type ConnectorConfig } from "./config.js";
import { CockroachCloudClient } from "./client.js";
import { enforcePolicy, payloadWithoutApproval, TOOL_RISK } from "./policy.js";

const clusterId = z.string().uuid();
const username = z.string().min(1).max(128).regex(/^[A-Za-z_][A-Za-z0-9_.@-]*$/);
const pagination = z.object({ page: z.number().int().min(1).max(100000).default(1), limit: z.number().int().min(1).max(100).default(50) }).strict();

const schemas = {
  "cockroachdb_cloud.cluster.list": pagination,
  "cockroachdb_cloud.cluster.get": z.object({ clusterId }).strict(),
  "cockroachdb_cloud.cluster.nodes.list": z.object({ clusterId }).strict(),
  "cockroachdb_cloud.cluster.connection_string.get": z.object({ clusterId, database: z.string().min(1).max(128).optional(), sqlUser: username.optional(), os: z.enum(["MAC", "LINUX", "WINDOWS"]).optional() }).strict(),
  "cockroachdb_cloud.cluster.version.list": pagination,
  "cockroachdb_cloud.database.list": z.object({ clusterId, page: z.number().int().min(1).max(100000).default(1), limit: z.number().int().min(1).max(100).default(50) }).strict(),
  "cockroachdb_cloud.sql_user.list": z.object({ clusterId, page: z.number().int().min(1).max(100000).default(1), limit: z.number().int().min(1).max(100).default(50) }).strict(),
  "cockroachdb_cloud.cluster.delete": z.object({ clusterId, confirmClusterId: clusterId, approvalId: z.string().length(64) }).strict().refine((x) => x.clusterId === x.confirmClusterId, { message: "confirmClusterId must exactly match clusterId" }),
  "cockroachdb_cloud.sql_user.delete": z.object({ clusterId, username, confirmUsername: username, approvalId: z.string().length(64) }).strict().refine((x) => x.username === x.confirmUsername, { message: "confirmUsername must exactly match username" })
} as const;

type ToolName = keyof typeof schemas;

const descriptions: Record<ToolName, string> = {
  "cockroachdb_cloud.cluster.list": "List CockroachDB Cloud clusters with bounded pagination.",
  "cockroachdb_cloud.cluster.get": "Get one CockroachDB Cloud cluster by UUID.",
  "cockroachdb_cloud.cluster.nodes.list": "List nodes for a CockroachDB Cloud cluster.",
  "cockroachdb_cloud.cluster.connection_string.get": "Get a formatted connection string for a cluster without returning SQL passwords.",
  "cockroachdb_cloud.cluster.version.list": "List available CockroachDB Cloud major cluster versions.",
  "cockroachdb_cloud.database.list": "List databases for a CockroachDB Cloud cluster.",
  "cockroachdb_cloud.sql_user.list": "List SQL users for a CockroachDB Cloud cluster.",
  "cockroachdb_cloud.cluster.delete": "Permanently delete a CockroachDB Cloud cluster. Requires exact confirmation and human approval.",
  "cockroachdb_cloud.sql_user.delete": "Delete a SQL user from a CockroachDB Cloud cluster. Requires exact confirmation and human approval."
};

export function buildServer(config: ConnectorConfig, client: CockroachCloudClient = new CockroachCloudClient(config)): Server {
  const server = new Server({ name: "cockroachdb-cloud-safe-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: (Object.keys(schemas) as ToolName[]).map((name) => ({
      name,
      description: `${descriptions[name]} Permission=${TOOL_RISK[name]}; approval=${TOOL_RISK[name] === "READ" ? "not-required" : "required"}.`,
      inputSchema: zodToJsonSchemaShape(schemas[name])
    }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name as ToolName;
    const schema = schemas[name];
    if (!schema) throw new Error("Unknown or unapproved tool");
    const parsed = schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
    enforcePolicy(name, parsed, config);

    const result = await execute(name, parsed, client);
    return {
      content: [{ type: "text", text: JSON.stringify({ untrusted_provider_content: true, data: result }) }]
    };
  });

  return server;
}

async function execute(name: ToolName, input: Record<string, unknown>, client: CockroachCloudClient): Promise<unknown> {
  const clean = payloadWithoutApproval(input);
  switch (name) {
    case "cockroachdb_cloud.cluster.list":
      return client.request("GET", "/clusters", { query: { page: clean.page as number, limit: clean.limit as number } });
    case "cockroachdb_cloud.cluster.get":
      return client.request("GET", `/clusters/${encodeURIComponent(clean.clusterId as string)}`);
    case "cockroachdb_cloud.cluster.nodes.list":
      return client.request("GET", `/clusters/${encodeURIComponent(clean.clusterId as string)}/nodes`);
    case "cockroachdb_cloud.cluster.connection_string.get":
      return client.request("GET", `/clusters/${encodeURIComponent(clean.clusterId as string)}/connection-string`, { query: { database: clean.database as string | undefined, sql_user: clean.sqlUser as string | undefined, os: clean.os as string | undefined } });
    case "cockroachdb_cloud.cluster.version.list":
      return client.request("GET", "/cluster-versions", { query: { page: clean.page as number, limit: clean.limit as number } });
    case "cockroachdb_cloud.database.list":
      return client.request("GET", `/clusters/${encodeURIComponent(clean.clusterId as string)}/databases`, { query: { page: clean.page as number, limit: clean.limit as number } });
    case "cockroachdb_cloud.sql_user.list":
      return client.request("GET", `/clusters/${encodeURIComponent(clean.clusterId as string)}/sql-users`, { query: { page: clean.page as number, limit: clean.limit as number } });
    case "cockroachdb_cloud.cluster.delete":
      return client.request("DELETE", `/clusters/${encodeURIComponent(clean.clusterId as string)}`, { retryable: false });
    case "cockroachdb_cloud.sql_user.delete":
      return client.request("DELETE", `/clusters/${encodeURIComponent(clean.clusterId as string)}/sql-users/${encodeURIComponent(clean.username as string)}`, { retryable: false });
  }
}

function zodToJsonSchemaShape(schema: z.ZodTypeAny): { type: "object"; properties?: Record<string, unknown>; required?: string[]; additionalProperties: false } {
  const raw = (schema as any)._def?.schema ?? schema;
  const shape = raw instanceof z.ZodObject ? raw.shape : undefined;
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  if (shape) {
    for (const [key, value] of Object.entries(shape)) {
      properties[key] = zodFieldToJson(value as z.ZodTypeAny);
      if (!(value instanceof z.ZodOptional) && !(value instanceof z.ZodDefault)) required.push(key);
    }
  }
  return { type: "object", properties, required, additionalProperties: false };
}

function zodFieldToJson(field: z.ZodTypeAny): Record<string, unknown> {
  let f: z.ZodTypeAny = field;
  while (f instanceof z.ZodOptional || f instanceof z.ZodDefault) f = f._def.innerType;
  if (f instanceof z.ZodNumber) return { type: "integer" };
  if (f instanceof z.ZodEnum) return { type: "string", enum: f.options };
  return { type: "string" };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = loadConfig();
  const server = buildServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
