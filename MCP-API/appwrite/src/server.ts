import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { AppwriteApiError, AppwriteRestClient } from "./rest.js";
import { AppwriteMcpClient } from "./upstream.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const rest = new AppwriteRestClient(config);
const upstream = new AppwriteMcpClient(config);

const text = (v: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }] });
const snake = (a: Record<string, unknown>) => Object.fromEntries(Object.entries(a).map(([k, v]) => [k.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`), v]));
const q = (a: Record<string, unknown>) => ({ "queries[]": Array.isArray(a.queries) ? a.queries.map(String) : undefined, total: a.total === undefined ? undefined : String(a.total) });

async function restDispatch(name: string, a: Record<string, unknown>) {
  switch (name) {
    case "appwrite.user.list": return rest.request("GET", "/users", undefined, q(a));
    case "appwrite.user.get": return rest.request("GET", `/users/${encodeURIComponent(String(a.userId))}`);
    case "appwrite.user.create": return rest.request("POST", "/users", { userId: a.userId, email: a.email, phone: a.phone, password: a.password, name: a.name });
    case "appwrite.user.update_name": return rest.request("PATCH", `/users/${encodeURIComponent(String(a.userId))}/name`, { name: a.name });
    case "appwrite.user.delete": return rest.request("DELETE", `/users/${encodeURIComponent(String(a.userId))}`);
    case "appwrite.storage.bucket.list": return rest.request("GET", "/storage/buckets", undefined, q(a));
    case "appwrite.storage.bucket.get": return rest.request("GET", `/storage/buckets/${encodeURIComponent(String(a.bucketId))}`);
    case "appwrite.storage.bucket.create": return rest.request("POST", "/storage/buckets", { bucketId: a.bucketId, name: a.name, fileSecurity: a.fileSecurity, enabled: a.enabled });
    case "appwrite.storage.bucket.delete": return rest.request("DELETE", `/storage/buckets/${encodeURIComponent(String(a.bucketId))}`);
    case "appwrite.function.list": return rest.request("GET", "/functions", undefined, q(a));
    case "appwrite.function.get": return rest.request("GET", `/functions/${encodeURIComponent(String(a.functionId))}`);
    case "appwrite.function.create": return rest.request("POST", "/functions", { functionId: a.functionId, name: a.name, runtime: a.runtime, entrypoint: a.entrypoint, enabled: a.enabled });
    case "appwrite.function.execution.create": return rest.request("POST", `/functions/${encodeURIComponent(String(a.functionId))}/executions`, { body: a.body, async: a.async, path: a.path });
    case "appwrite.function.delete": return rest.request("DELETE", `/functions/${encodeURIComponent(String(a.functionId))}`);
    default: throw new Error("No REST fallback exists for this Appwrite tool.");
  }
}

async function dispatch(name: string, a: Record<string, unknown>, risk: string, hidden?: string) {
  if (name === "appwrite.context.get") {
    if (!upstream.available()) throw new Error("appwrite.context.get requires APPWRITE_MCP_ACCESS_TOKEN because this capability is served by official Appwrite MCP.");
    return upstream.publicTool("appwrite_get_context", { project_id: config.projectId || undefined, include_services: a.includeServices ?? true });
  }
  if (name === "appwrite.docs.search") {
    if (!upstream.available()) throw new Error("appwrite.docs.search requires APPWRITE_MCP_ACCESS_TOKEN because this capability is served by official Appwrite MCP.");
    return upstream.publicTool("appwrite_search_docs", { query: a.query });
  }
  if (upstream.available() && hidden) {
    try { return await upstream.hiddenTool(hidden, snake(a), risk !== "READ"); }
    catch (error) {
      if (!rest.available()) throw error;
      if (risk !== "READ") throw error;
    }
  }
  return restDispatch(name, a);
}

export const server = new Server({ name: "appwrite-hybrid-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name: t.name, description: `${t.purpose} Risk=${t.risk}.`, inputSchema: t.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async req => {
  const tool = TOOL_MAP.get(req.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(req.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try { return text(await dispatch(tool.name, args, tool.risk, tool.upstream)); }
  catch (error) {
    if (error instanceof AppwriteApiError) {
      if (error.status === 401) throw new Error("Appwrite authentication failed. Re-authorize MCP OAuth or rotate the API key.");
      if (error.status === 403) throw new Error("Appwrite denied this operation. Verify the API key scopes and project access.");
      if (error.status === 404) throw new Error("Appwrite resource not found.");
      if (error.status === 409) throw new Error(`Appwrite resource conflict: ${error.message}`);
      if (error.status === 429) throw new Error(`Appwrite rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
