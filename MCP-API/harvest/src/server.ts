import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { HarvestApiError, HarvestClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOL_MAP, TOOLS } from "./tools.js";

const config = loadConfig();
const client = new HarvestClient(config);
const text = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify({ source: "untrusted_provider_data", data: value }, null, 2) }] });
const q = (v: unknown) => v === undefined ? undefined : v as string | number | boolean;

function pageQuery(a: Record<string, unknown>) {
  return { per_page:q(a.perPage), page:q(a.page), cursor:q(a.cursor) };
}

async function dispatch(name: string, a: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "harvest.user.me": return client.request("GET", "/users/me");
    case "harvest.user.list": return client.request("GET", "/users", undefined, pageQuery(a));
    case "harvest.client.list": return client.request("GET", "/clients", undefined, { ...pageQuery(a), is_active:q(a.isActive) });
    case "harvest.client.get": return client.request("GET", `/clients/${a.clientId}`);
    case "harvest.project.list": return client.request("GET", "/projects", undefined, { ...pageQuery(a), client_id:q(a.clientId), is_active:q(a.isActive) });
    case "harvest.project.get": return client.request("GET", `/projects/${a.projectId}`);
    case "harvest.task.list": return client.request("GET", "/tasks", undefined, { ...pageQuery(a), is_active:q(a.isActive) });
    case "harvest.time_entry.list": return client.request("GET", "/time_entries", undefined, { ...pageQuery(a), user_id:q(a.userId), project_id:q(a.projectId), from:q(a.from), to:q(a.to) });
    case "harvest.time_entry.get": return client.request("GET", `/time_entries/${a.timeEntryId}`);
    case "harvest.time_entry.create": return client.request("POST", "/time_entries", {
      project_id:a.projectId, task_id:a.taskId, spent_date:a.spentDate, hours:a.hours, notes:a.notes, user_id:a.userId
    });
    case "harvest.time_entry.update": return client.request("PATCH", `/time_entries/${a.timeEntryId}`, {
      hours:a.hours, notes:a.notes, spent_date:a.spentDate
    });
    case "harvest.time_entry.stop": return client.request("PATCH", `/time_entries/${a.timeEntryId}/stop`);
    case "harvest.time_entry.restart": return client.request("PATCH", `/time_entries/${a.timeEntryId}/restart`);
    case "harvest.expense.list": return client.request("GET", "/expenses", undefined, { ...pageQuery(a), user_id:q(a.userId), project_id:q(a.projectId), from:q(a.from), to:q(a.to) });
    case "harvest.invoice.list": return client.request("GET", "/invoices", undefined, { ...pageQuery(a), client_id:q(a.clientId) });
    case "harvest.report.project_time": return client.request("GET", "/reports/time/projects", undefined, { from:q(a.from), to:q(a.to), per_page:q(a.perPage), page:q(a.page) });
    default: throw new Error("Unknown Harvest tool.");
  }
}

export const server = new Server({ name:"harvest-connector", version:"1.0.0" }, { capabilities:{ tools:{} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(tool => ({
    name: tool.name,
    description: `${tool.description} Permission=${tool.permission}. Risk=${tool.risk}. Approval=${tool.approval}.`,
    inputSchema: tool.inputSchema as any
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try {
    return text(await dispatch(tool.name, args));
  } catch (error) {
    if (error instanceof HarvestApiError) {
      if (error.status === 400) throw new Error("Harvest rejected the request. Verify required headers and parameters.");
      if (error.status === 401) throw new Error("Harvest authentication failed. Verify the access token.");
      if (error.status === 403) throw new Error("Harvest denied this operation. Verify account role and resource permissions.");
      if (error.status === 404) throw new Error("Harvest resource was not found.");
      if (error.status === 422) throw new Error("Harvest validation failed for the supplied fields.");
      if (error.status === 429) throw new Error(`Harvest rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter} seconds.` : ""}`);
      if (error.status >= 500) throw new Error("Harvest service returned a server error after bounded retries.");
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
