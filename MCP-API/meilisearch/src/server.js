import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { MeilisearchClient, MeilisearchError } from "./client.js";
import { assertAuthorized } from "./policy.js";
import { TOOL_DEFINITIONS, stripApproval } from "./tools.js";

export function createServer({ config = loadConfig(), client = null } = {}) {
  const api = client || new MeilisearchClient(config);
  const server = new Server(
    { name: "meilisearch-safe-connector", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFINITIONS }));

  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    const name = request.params.name;
    const args = request.params.arguments || {};
    const payload = stripApproval(args);
    assertAuthorized(config, name, payload, args.approval_token);

    try {
      const signal = extra?.signal;
      let result;
      switch (name) {
        case "meilisearch.system.health": result = await api.health(signal); break;
        case "meilisearch.system.version": result = await api.version(signal); break;
        case "meilisearch.index.list": result = await api.listIndexes({ offset: args.offset ?? 0, limit: args.limit ?? 20 }, signal); break;
        case "meilisearch.index.get": result = await api.getIndex(args.uid, signal); break;
        case "meilisearch.index.create": result = await api.createIndex(payload, signal); break;
        case "meilisearch.index.update":
          if (payload.newUid === undefined && payload.primaryKey === undefined) throw new Error("index.update requires newUid and/or primaryKey");
          result = await api.updateIndex(payload, signal); break;
        case "meilisearch.index.delete": result = await api.deleteIndex(args.uid, signal); break;
        case "meilisearch.search.query": result = await api.search({ ...payload, limit: payload.limit ?? 20 }, signal); break;
        case "meilisearch.document.list": result = await api.listDocuments({ ...payload, offset: payload.offset ?? 0, limit: payload.limit ?? 20 }, signal); break;
        case "meilisearch.document.get": result = await api.getDocument(payload, signal); break;
        case "meilisearch.document.add_or_update": result = await api.addOrUpdateDocuments(payload, signal); break;
        case "meilisearch.document.delete": result = await api.deleteDocument(payload, signal); break;
        case "meilisearch.settings.get": result = await api.getSettings(args.uid, signal); break;
        case "meilisearch.settings.update": result = await api.updateSettings(payload, signal); break;
        case "meilisearch.task.get": result = await api.getTask(args.uid, signal); break;
        case "meilisearch.task.list": result = await api.listTasks({ ...payload, limit: payload.limit ?? 20 }, signal); break;
        case "meilisearch.task.cancel": {
          const hasFilter = ["uids", "indexUids", "statuses", "types"].some((k) => Array.isArray(payload[k]) && payload[k].length);
          if (!hasFilter) throw new Error("task.cancel requires at least one filter");
          result = await api.cancelTasks(payload, signal); break;
        }
        default: throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [{ type: "text", text: JSON.stringify({ untrusted_provider_data: true, data: result }, null, 2) }],
        structuredContent: { untrusted_provider_data: true, data: result }
      };
    } catch (error) {
      const details = error instanceof MeilisearchError
        ? { status: error.status, code: error.code, type: error.type, retryAfter: error.retryAfter }
        : undefined;
      return {
        isError: true,
        content: [{ type: "text", text: JSON.stringify({ error: error?.message || String(error), ...(details ? { details } : {}) }) }]
      };
    }
  });

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}
