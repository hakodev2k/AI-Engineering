import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ClockifyApiError, ClockifyClient } from "./client.js";
import { loadConfig } from "./config.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const client = new ClockifyClient(config);
const e = (value: unknown) => encodeURIComponent(String(value));
const output = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify({ source: "untrusted_provider_data", data }, null, 2) }] });

function pagination(a: Record<string, unknown>) {
  return { page: a.page as number | undefined, "page-size": a.pageSize as number | undefined };
}

async function dispatch(name: string, a: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "clockify.workspace.list": return client.request("/workspaces");
    case "clockify.user.me": return client.request("/user");
    case "clockify.project.list": return client.request(`/workspaces/${e(a.workspaceId)}/projects`, { query: { ...pagination(a), name:a.name as string|undefined, archived:a.archived as boolean|undefined } });
    case "clockify.project.get": return client.request(`/workspaces/${e(a.workspaceId)}/projects/${e(a.projectId)}`);
    case "clockify.project.create": return client.request(`/workspaces/${e(a.workspaceId)}/projects`, { method:"POST", retryable:false, body:{ name:a.name, clientId:a.clientId, isPublic:a.isPublic, billable:a.billable } });
    case "clockify.project.update": return client.request(`/workspaces/${e(a.workspaceId)}/projects/${e(a.projectId)}`, { method:"PUT", retryable:false, body:{ name:a.name, clientId:a.clientId, isPublic:a.isPublic, billable:a.billable, archived:a.archived } });
    case "clockify.task.list": return client.request(`/workspaces/${e(a.workspaceId)}/projects/${e(a.projectId)}/tasks`, { query:{ ...pagination(a), "is-active":a.isActive as boolean|undefined } });
    case "clockify.client.list": return client.request(`/workspaces/${e(a.workspaceId)}/clients`, { query:{ ...pagination(a), name:a.name as string|undefined, archived:a.archived as boolean|undefined } });
    case "clockify.tag.list": return client.request(`/workspaces/${e(a.workspaceId)}/tags`, { query:{ ...pagination(a), name:a.name as string|undefined, archived:a.archived as boolean|undefined } });
    case "clockify.time_entry.list": return client.request(`/workspaces/${e(a.workspaceId)}/user/${e(a.userId)}/time-entries`, { query:{ ...pagination(a), start:a.start as string|undefined, end:a.end as string|undefined, project:a.projectId as string|undefined, description:a.description as string|undefined } });
    case "clockify.time_entry.get": return client.request(`/workspaces/${e(a.workspaceId)}/time-entries/${e(a.timeEntryId)}`, { query:{ hydrated:a.hydrated as boolean|undefined } });
    case "clockify.time_entry.create": return client.request(`/workspaces/${e(a.workspaceId)}/user/${e(a.userId)}/time-entries`, { method:"POST", retryable:false, body:{ start:a.start, end:a.end, description:a.description, projectId:a.projectId, taskId:a.taskId, billable:a.billable, tagIds:a.tagIds } });
    case "clockify.time_entry.update": return client.request(`/workspaces/${e(a.workspaceId)}/time-entries/${e(a.timeEntryId)}`, { method:"PUT", retryable:false, body:{ start:a.start, end:a.end, description:a.description, projectId:a.projectId, taskId:a.taskId, billable:a.billable, tagIds:a.tagIds } });
    case "clockify.time_entry.delete": return client.request(`/workspaces/${e(a.workspaceId)}/time-entries/${e(a.timeEntryId)}`, { method:"DELETE", retryable:false });
    case "clockify.timer.stop": return client.request(`/workspaces/${e(a.workspaceId)}/user/${e(a.userId)}/time-entries`, { method:"PATCH", retryable:false, body:{ end:a.end } });
    case "clockify.report.detailed": return client.request(`/workspaces/${e(a.workspaceId)}/reports/detailed`, { method:"POST", reports:true, retryable:true, body:{ dateRangeStart:a.dateRangeStart, dateRangeEnd:a.dateRangeEnd, detailedFilter:{ page:a.page ?? 1, pageSize:a.pageSize ?? 50 }, billable:a.billable } });
    default: throw new Error("Tool is not exposed by this connector.");
  }
}

export const server = new Server({ name:"clockify-connector", version:"1.0.0" }, { capabilities:{ tools:{} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(tool => ({ name:tool.name, description:`${tool.description} Risk=${tool.risk}.`, inputSchema:tool.inputSchema as any }))
}));

server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, args, config);
  try { return output(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof ClockifyApiError) {
      if (error.status === 401) throw new Error("Clockify authentication failed. Verify CLOCKIFY_API_KEY.");
      if (error.status === 403) throw new Error("Clockify denied the operation. Verify workspace role and API-key permissions.");
      if (error.status === 404) throw new Error("Clockify resource was not found.");
      if (error.status === 400 || error.status === 422) throw new Error(`Clockify validation failed: ${error.message}`);
      if (error.status === 429) throw new Error(`Clockify rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  server.connect(transport).catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
