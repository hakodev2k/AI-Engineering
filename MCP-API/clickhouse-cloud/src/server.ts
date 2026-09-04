import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { ClickHouseCloudClient, CloudError } from "./cloud-client.js";
import { TOOLS, TOOL_MAP } from "./tools.js";
import { createOfficialClickHouseMcp, withTimeout, type QueryMcpClient } from "./upstream-mcp.js";

function result(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ data, trust: "untrusted-provider-data" }) }] };
}

export async function buildServer(deps?: { mcp?: QueryMcpClient; cloud?: ClickHouseCloudClient }) {
  const cfg = loadConfig();
  const mcp = deps?.mcp ?? await createOfficialClickHouseMcp(cfg);
  const cloud = deps?.cloud ?? new ClickHouseCloudClient(cfg);
  const discovered = await withTimeout(mcp.listTools(), cfg.mcpTimeoutMs);
  const names = new Set(discovered.tools.map(t => t.name));
  for (const required of ["list_databases", "list_tables", "run_query"]) if (!names.has(required)) throw new Error(`Official ClickHouse MCP missing required tool: ${required}`);

  const server = new Server({ name: "clickhouse-cloud-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name: t.name, description: `${t.description} Credentials are isolated inside the connector.`, inputSchema: t.schema })) }));
  server.setRequestHandler(CallToolRequestSchema, async req => {
    const tool = TOOL_MAP.get(req.params.name);
    if (!tool) throw new Error("Unknown or non-allowlisted ClickHouse tool");
    const a = (req.params.arguments ?? {}) as Record<string, unknown>;
    try {
      if (tool.transport === "mcp") return await withTimeout(mcp.callTool({ name: tool.upstream!, arguments: a }), cfg.mcpTimeoutMs) as never;
      const sid = String(a.serviceId ?? "");
      switch (tool.name) {
        case "clickhouse.cloud.service.list": return result(await cloud.services());
        case "clickhouse.cloud.service.get": return result(await cloud.service(sid));
        case "clickhouse.cloud.clickpipe.list": return result(await cloud.clickpipes(sid));
        case "clickhouse.cloud.clickpipe.get": return result(await cloud.clickpipe(sid, String(a.clickpipeId ?? "")));
        case "clickhouse.cloud.backup.list": return result(await cloud.backups(sid));
        case "clickhouse.cloud.backup.get": return result(await cloud.backup(sid, String(a.backupId ?? "")));
        case "clickhouse.cloud.backup_configuration.get": return result(await cloud.backupConfiguration(sid));
        case "clickhouse.cloud.clickstack.source.list": return result(await cloud.clickstackSources(sid));
        case "clickhouse.cloud.clickstack.webhook.list": return result(await cloud.clickstackWebhooks(sid));
        default: throw new Error("Tool transport route is not implemented");
      }
    } catch (e) {
      if (e instanceof CloudError) {
        if (e.status === 401) throw new Error("ClickHouse Cloud authentication failed. Check API key ID and secret.");
        if (e.status === 403) throw new Error("ClickHouse Cloud denied this read. Use a least-privilege key with the required service scope.");
        if (e.status === 429) throw new Error(`ClickHouse Cloud rate limit reached.${e.retryAfter ? ` Retry-After=${e.retryAfter}` : ""}`);
      }
      throw e;
    }
  });
  return { server, close: () => mcp.close() };
}

async function main() {
  const { server, close } = await buildServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => { await close(); process.exit(0); };
  process.once("SIGINT", shutdown); process.once("SIGTERM", shutdown);
  await server.connect(transport);
}
if (import.meta.url === `file://${process.argv[1]}`) main().catch(e => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
