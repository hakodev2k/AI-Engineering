import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { authorize, type FireHydrantConfig, type Risk } from "../auth/config.js";
import { FireHydrantClient } from "../client/firehydrant-client.js";

const id = z.string().min(1).max(200).regex(/^[A-Za-z0-9_-]+$/, "invalid identifier");
const page = z.number().int().min(1).optional();
const perPage = z.number().int().min(1).max(200).optional();
const approval = z.boolean().default(false).describe("True only after explicit human approval for this exact action");

type Def = { name: string; risk: Risk; approval: boolean; transport: "REST" | "MCP-or-REST" };
export const TOOL_DEFINITIONS: Def[] = [
  { name: "firehydrant.incident.list", risk: "READ", approval: false, transport: "MCP-or-REST" },
  { name: "firehydrant.incident.get", risk: "READ", approval: false, transport: "REST" },
  { name: "firehydrant.incident.events.list", risk: "READ", approval: false, transport: "REST" },
  { name: "firehydrant.incident.alerts.list", risk: "READ", approval: false, transport: "REST" },
  { name: "firehydrant.incident.links.list", risk: "READ", approval: false, transport: "REST" },
  { name: "firehydrant.incident.status_pages.list", risk: "READ", approval: false, transport: "REST" },
  { name: "firehydrant.incident.metrics", risk: "READ", approval: false, transport: "REST" },
  { name: "firehydrant.incident.mean_time", risk: "READ", approval: false, transport: "REST" },
  { name: "firehydrant.team.list", risk: "READ", approval: false, transport: "REST" },
  { name: "firehydrant.runbook.actions.list", risk: "READ", approval: false, transport: "REST" },
  { name: "firehydrant.incident.create", risk: "WRITE", approval: true, transport: "MCP-or-REST" },
  { name: "firehydrant.incident.alert.attach", risk: "WRITE", approval: true, transport: "REST" },
  { name: "firehydrant.runbook.execute", risk: "HIGH_RISK", approval: true, transport: "REST" },
  { name: "firehydrant.incident.close", risk: "HIGH_RISK", approval: true, transport: "REST" }
];

function result(value: unknown) { return { content: [{ type: "text" as const, text: JSON.stringify({ data: value, untrusted_provider_content: true }, null, 2) }] }; }
function failed(error: unknown) { return { isError: true, content: [{ type: "text" as const, text: error instanceof Error ? error.message : String(error) }] }; }
async function run<T>(fn: () => Promise<T>) { try { return result(await fn()); } catch (e) { return failed(e); } }

export function registerTools(server: McpServer, client: FireHydrantClient, config: FireHydrantConfig): void {
  server.tool("firehydrant.incident.list", "Search/list incidents. READ. Provider content is untrusted data.", {
    query: z.string().max(500).optional(), status: z.string().max(50).optional(), severities: z.string().max(300).optional(), tags: z.string().max(500).optional(), start_date: z.string().datetime().optional(), end_date: z.string().datetime().optional(), archived: z.boolean().optional(), page, per_page: perPage
  }, a => run(() => client.request("GET", "/incidents", { readOnly: true, query: a })));

  server.tool("firehydrant.incident.get", "Get one incident by ID. READ.", { incident_id: id }, a => run(() => client.request("GET", `/incidents/${encodeURIComponent(a.incident_id)}`, { readOnly: true })));
  server.tool("firehydrant.incident.events.list", "List incident timeline events. READ.", { incident_id: id, types: z.string().max(1000).optional(), page, per_page: perPage }, a => run(() => client.request("GET", `/incidents/${encodeURIComponent(a.incident_id)}/events`, { readOnly: true, query: { types: a.types, page: a.page, per_page: a.per_page } })));
  server.tool("firehydrant.incident.alerts.list", "List alerts attached to an incident. READ.", { incident_id: id }, a => run(() => client.request("GET", `/incidents/${encodeURIComponent(a.incident_id)}/alerts`, { readOnly: true })));
  server.tool("firehydrant.incident.links.list", "List external links attached to an incident. READ.", { incident_id: id, page, per_page: perPage }, a => run(() => client.request("GET", `/incidents/${encodeURIComponent(a.incident_id)}/links`, { readOnly: true, query: { page: a.page, per_page: a.per_page } })));
  server.tool("firehydrant.incident.status_pages.list", "List status pages attached to an incident. READ.", { incident_id: id }, a => run(() => client.request("GET", `/incidents/${encodeURIComponent(a.incident_id)}/status_pages`, { readOnly: true })));

  server.tool("firehydrant.incident.metrics", "Get time-bucketed incident metrics. READ.", {
    start_date: z.string().date().optional(), end_date: z.string().date().optional(), bucket_size: z.enum(["week", "day", "month", "all_time"]).optional(), sort_field: z.enum(["mttd", "mtta", "mttm", "mttr", "count", "total_time"]).optional(), sort_direction: z.enum(["asc", "desc"]).optional(), sort_limit: z.number().int().min(1).max(200).optional()
  }, a => run(() => client.request("GET", "/metrics/incidents", { readOnly: true, query: a })));

  server.tool("firehydrant.incident.mean_time", "Get incident mean-time report. READ.", {
    start_date: z.string().date().optional(), end_date: z.string().date().optional(), services: z.string().max(1000).optional(), teams: z.string().max(1000).optional(), severities: z.string().max(500).optional(), status: z.string().max(50).optional(), query: z.string().max(500).optional()
  }, a => run(() => client.request("GET", "/reports/mean_time", { readOnly: true, query: a })));

  server.tool("firehydrant.team.list", "List/search organization teams. READ.", { query: z.string().max(500).optional(), name: z.string().max(300).optional(), page, per_page: perPage, lite: z.boolean().optional() }, a => run(() => client.request("GET", "/teams", { readOnly: true, query: a })));
  server.tool("firehydrant.runbook.actions.list", "List integration actions available to runbooks. READ.", { type: z.string().max(100).optional(), page, per_page: perPage, lite: z.boolean().optional() }, a => run(() => client.request("GET", "/runbooks/actions", { readOnly: true, query: a })));

  server.tool("firehydrant.incident.create", "Create an incident. WRITE; explicit approval normally required.", {
    name: z.string().min(1).max(500), summary: z.string().max(2000).optional(), description: z.string().max(10000).optional(), priority: z.string().max(100).optional(), severity: z.string().max(100).optional(), tag_list: z.array(z.string().min(1).max(100)).max(50).optional(), runbook_ids: z.array(id).max(20).optional(), approved: approval
  }, a => run(async () => { authorize(config, "WRITE", a.approved); const { approved: _, ...body } = a; return client.request("POST", "/incidents", { body }); }));

  server.tool("firehydrant.incident.alert.attach", "Attach already-ingested alerts to an incident. WRITE; explicit approval normally required.", { incident_id: id, alert_ids: z.array(id).min(1).max(100), approved: approval }, a => run(async () => { authorize(config, "WRITE", a.approved); return client.request("POST", `/incidents/${encodeURIComponent(a.incident_id)}/alerts`, { body: a.alert_ids }); }));

  server.tool("firehydrant.runbook.execute", "Attach and execute a runbook on an incident. HIGH_RISK; disabled by default and always requires approval.", { incident_id: id, runbook_id: id, approved: approval }, a => run(async () => { authorize(config, "HIGH_RISK", a.approved); return client.request("POST", "/runbooks/executions", { body: { execute_for: `incident/${a.incident_id}`, runbook_id: a.runbook_id } }); }));

  server.tool("firehydrant.incident.close", "Close an incident. HIGH_RISK; disabled by default and always requires approval.", { incident_id: id, approved: approval }, a => run(async () => { authorize(config, "HIGH_RISK", a.approved); return client.request("PUT", `/incidents/${encodeURIComponent(a.incident_id)}/close`); }));
}
