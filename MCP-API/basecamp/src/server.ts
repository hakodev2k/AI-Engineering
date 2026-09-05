import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { BasecampApiError, BasecampClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const api = new BasecampClient(config);
const enc = (v: unknown) => encodeURIComponent(String(v));
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });

async function dispatch(name: string, a: Record<string, unknown>) {
  switch (name) {
    case "basecamp.profile.get": return api.request("GET", "/my/profile.json");
    case "basecamp.project.list": return api.request("GET", "/projects.json", undefined, { status: a.status ? String(a.status) : undefined, page: a.page ? String(a.page) : undefined });
    case "basecamp.project.get": return api.request("GET", `/projects/${enc(a.projectId)}.json`);
    case "basecamp.people.list": return api.request("GET", "/people.json", undefined, { page: a.page ? String(a.page) : undefined });
    case "basecamp.project.people.list": return api.request("GET", `/projects/${enc(a.projectId)}/people.json`, undefined, { page: a.page ? String(a.page) : undefined });
    case "basecamp.todolist.get": return api.request("GET", `/todolists/${enc(a.todolistId)}.json`);
    case "basecamp.todo.list": return api.request("GET", `/todolists/${enc(a.todolistId)}/todos.json`, undefined, { status: a.status ? String(a.status) : undefined, completed: a.completed === undefined ? undefined : String(a.completed), page: a.page ? String(a.page) : undefined });
    case "basecamp.todo.get": return api.request("GET", `/todos/${enc(a.todoId)}.json`);
    case "basecamp.todo.create": return api.request("POST", `/todolists/${enc(a.todolistId)}/todos.json`, {
      content: a.content,
      ...(a.description !== undefined ? { description: a.description } : {}),
      ...(a.assigneeIds !== undefined ? { assignee_ids: a.assigneeIds } : {}),
      ...(a.dueOn !== undefined ? { due_on: a.dueOn } : {}),
      ...(a.startsOn !== undefined ? { starts_on: a.startsOn } : {}),
      ...(a.notify !== undefined ? { notify: a.notify } : {})
    });
    case "basecamp.todo.complete": return api.request("POST", `/todos/${enc(a.todoId)}/completion.json`, {});
    case "basecamp.todo.uncomplete": return api.request("DELETE", `/todos/${enc(a.todoId)}/completion.json`);
    case "basecamp.message.list": return api.request("GET", `/message_boards/${enc(a.messageBoardId)}/messages.json`, undefined, { sort: a.sort ? String(a.sort) : undefined, direction: a.direction ? String(a.direction) : undefined, page: a.page ? String(a.page) : undefined });
    case "basecamp.message.get": return api.request("GET", `/messages/${enc(a.messageId)}.json`);
    case "basecamp.message.draft.create": return api.request("POST", `/message_boards/${enc(a.messageBoardId)}/messages.json`, {
      subject: a.subject,
      ...(a.content !== undefined ? { content: a.content } : {}),
      ...(a.visibleToClients !== undefined ? { visible_to_clients: a.visibleToClients } : {})
    });
    case "basecamp.message.publish": return api.request("PUT", `/messages/${enc(a.messageId)}.json`, { status: "active" });
    case "basecamp.comment.list": return api.request("GET", `/recordings/${enc(a.recordingId)}/comments.json`, undefined, { page: a.page ? String(a.page) : undefined });
    case "basecamp.comment.create": return api.request("POST", `/recordings/${enc(a.recordingId)}/comments.json`, { content: a.content });
    default: throw new Error("Unknown Basecamp tool.");
  }
}

export const server = new Server({ name: "basecamp-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(t => ({ name: t.name, description: `${t.description} Risk=${t.risk}.`, inputSchema: t.inputSchema as any }))
}));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try {
    return result(await dispatch(tool.name, args));
  } catch (error) {
    if (error instanceof BasecampApiError) {
      if (error.status === 401) throw new Error("Basecamp authentication failed. Re-authorize OAuth.");
      if (error.status === 403) throw new Error("Basecamp denied this operation. Check project/account permissions.");
      if (error.status === 404 && error.reason === "Account Inactive") throw new Error("Basecamp account is inactive.");
      if (error.status === 404) throw new Error("Basecamp resource not found or not accessible.");
      if (error.status === 429) throw new Error(`Basecamp rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}s.` : ""}`);
      if (error.status === 507) throw new Error("Basecamp account limit exceeded; do not retry automatically.");
      if (error.status === 400 || error.status === 422) throw new Error(`Basecamp validation failed: ${error.message}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
