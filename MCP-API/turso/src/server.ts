import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { TursoApiError, TursoClient } from "./client.js";
import { assertAllowed, type Approval } from "./policy.js";
import { TOOLS } from "./tools.js";

const config = loadConfig();
const client = new TursoClient(config);
const toolMap = new Map(TOOLS.map((tool) => [tool.name, tool]));
const org = encodeURIComponent(config.org);

function result(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

async function dispatch(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "turso.organization.list": return client.request("GET", "/v1/organizations");
    case "turso.location.list": return client.request("GET", "/v1/locations");
    case "turso.group.list": return client.request("GET", `/v1/organizations/${org}/groups`);
    case "turso.group.configuration.get": return client.request("GET", `/v1/organizations/${org}/groups/${encodeURIComponent(String(args.group))}/configuration`);
    case "turso.database.list": return client.request("GET", `/v1/organizations/${org}/databases`, undefined, { group: args.group ? String(args.group) : undefined, schema: args.schema ? String(args.schema) : undefined, parent: args.parent ? String(args.parent) : undefined });
    case "turso.database.get": return client.request("GET", `/v1/organizations/${org}/databases/${encodeURIComponent(String(args.database))}`);
    case "turso.database.usage.get": return client.request("GET", `/v1/organizations/${org}/databases/${encodeURIComponent(String(args.database))}/usage`, undefined, { from: args.from ? String(args.from) : undefined, to: args.to ? String(args.to) : undefined });
    case "turso.organization.members.list": return client.request("GET", `/v1/organizations/${org}/members`);
    case "turso.organization.member.get": return client.request("GET", `/v1/organizations/${org}/members/${encodeURIComponent(String(args.username))}`);
    case "turso.organization.plans.list": return client.request("GET", `/v1/organizations/${org}/plans`);
    case "turso.audit_log.list": return client.request("GET", `/v1/organizations/${org}/audit-logs`, undefined, { page: args.page ? String(args.page) : undefined, page_size: args.page_size ? String(args.page_size) : undefined });
    case "turso.group.create": return client.request("POST", `/v1/organizations/${org}/groups`, { name: args.name, location: args.location });
    case "turso.database.create": {
      const body: Record<string, unknown> = { name: args.name, group: args.group };
      if (args.size_limit) body.size_limit = args.size_limit;
      return client.request("POST", `/v1/organizations/${org}/databases`, body);
    }
    default: throw new Error("Unknown Turso tool.");
  }
}

export const server = new Server({ name: "turso-platform-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map((tool) => ({ name: tool.name, description: `${tool.description} Risk=${tool.risk}.`, inputSchema: tool.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = toolMap.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = { ...(request.params.arguments ?? {}) } as Record<string, unknown>;
  const approval = args.approval as Approval | undefined;
  delete args.approval;
  assertAllowed(tool.risk, approval, config);
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof TursoApiError) {
      if (error.status === 401) throw new Error("Turso authentication failed. Verify TURSO_PLATFORM_TOKEN.");
      if (error.status === 403) throw new Error("Turso denied this operation. Verify token scope and organization permissions.");
      if (error.status === 402) throw new Error("Turso plan or quota prevents this operation.");
      if (error.status === 409) throw new Error(`Turso resource conflict: ${error.message}`);
      if (error.status === 429) throw new Error(`Turso rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
