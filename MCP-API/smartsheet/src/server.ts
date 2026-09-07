import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { assertAllowed } from "./policy.js";
import { TOOL_MAP, TOOLS } from "./tools.js";
import { SmartsheetMcpClient } from "./upstream.js";

function clean(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}

export function toUpstreamArgs(toolName: string, a: Record<string, unknown>): Record<string, unknown> {
  switch (toolName) {
    case "smartsheet.asset.search":
      return clean({ query: a.query, scopes: a.scopes });
    case "smartsheet.workspace.list":
      return clean({ max_items: a.maxItems, last_key: a.lastKey });
    case "smartsheet.workspace.browse":
      return { workspace_id: a.workspaceId };
    case "smartsheet.sheet.summary.get":
    case "smartsheet.sheet.version.get":
    case "smartsheet.sheet.columns.get":
      return { sheet_id: a.sheetId };
    case "smartsheet.sheet.find":
      return clean({
        sheet_id: a.sheetId,
        request: { term: a.query, caseSensitive: a.caseSensitive ?? false },
        limit: a.pageSize,
        offset: typeof a.page === "number" && typeof a.pageSize === "number" ? (a.page - 1) * a.pageSize : undefined
      });
    case "smartsheet.sheet.create":
      return {
        container_id: a.containerId,
        container_type: a.containerType,
        sheet: { name: a.name, columns: a.columns }
      };
    case "smartsheet.row.add":
    case "smartsheet.row.update":
      return { sheet_id: a.sheetId, rows: a.rows };
    case "smartsheet.discussion.list":
      return clean({ sheet_id: a.sheetId, page: a.page, page_size: a.pageSize });
    case "smartsheet.comment.add":
      return { sheet_id: a.sheetId, discussion_id: a.discussionId, comment: { text: a.text } };
    case "smartsheet.report.list": {
      const page = a.lastKey && /^\d+$/.test(String(a.lastKey)) ? Number(a.lastKey) : undefined;
      return clean({ page, page_size: a.maxItems });
    }
    default:
      throw new Error("Unknown Smartsheet tool.");
  }
}

export function createServer(config = loadConfig(), upstream = new SmartsheetMcpClient(config)): Server {
  const server = new Server({ name: "smartsheet-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map(tool => ({
      name: tool.name,
      description: `${tool.description} Risk=${tool.risk}. Upstream=official Smartsheet MCP (${tool.upstream}).`,
      inputSchema: tool.inputSchema as any
    }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const tool = TOOL_MAP.get(request.params.name);
    if (!tool) throw new Error("Tool is not exposed by this connector.");
    const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
    assertAllowed(tool.risk, tool.name, args, config);
    const upstreamArgs = toUpstreamArgs(tool.name, args);
    const value = await upstream.call(tool.upstream, upstreamArgs);
    return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
  });

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = loadConfig();
  const upstream = new SmartsheetMcpClient(config);
  const server = createServer(config, upstream);
  const shutdown = async () => {
    await upstream.close();
    await server.close().catch(() => undefined);
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  server.connect(new StdioServerTransport()).catch(error => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
