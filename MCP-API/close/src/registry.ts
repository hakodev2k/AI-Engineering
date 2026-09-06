export type Risk = "READ" | "WRITE" | "HIGH_RISK";

export interface ToolPolicy {
  alias: string;
  upstream: string;
  risk: Risk;
  purpose: string;
  approval: "none" | "configurable" | "explicit";
}

export const TOOL_POLICIES: readonly ToolPolicy[] = [
  { alias:"close.organization.get", upstream:"org_info", risk:"READ", purpose:"Read the current Close organization and authenticated user context.", approval:"none" },
  { alias:"close.lead.search", upstream:"lead_search", risk:"READ", purpose:"Search Close leads using the official MCP lead search capability.", approval:"none" },
  { alias:"close.lead.get", upstream:"fetch_lead", risk:"READ", purpose:"Fetch one lead by Close lead ID.", approval:"none" },
  { alias:"close.contact.get", upstream:"fetch_contact", risk:"READ", purpose:"Fetch one contact by Close contact ID.", approval:"none" },
  { alias:"close.activity.search", upstream:"activity_search", risk:"READ", purpose:"Search CRM activities such as calls, emails, meetings, and notes.", approval:"none" },
  { alias:"close.opportunity.search", upstream:"find_opportunities", risk:"READ", purpose:"Find opportunities using official Close MCP filters.", approval:"none" },
  { alias:"close.task.search", upstream:"find_tasks", risk:"READ", purpose:"Find tasks and follow-up work in Close.", approval:"none" },
  { alias:"close.contact.create", upstream:"create_contact", risk:"WRITE", purpose:"Create a contact associated with a Close lead.", approval:"configurable" },
  { alias:"close.note.create", upstream:"create_note", risk:"WRITE", purpose:"Create an internal note on a Close lead.", approval:"configurable" },
  { alias:"close.task.create", upstream:"create_task", risk:"WRITE", purpose:"Create a task for a lead or contact.", approval:"configurable" },
  { alias:"close.opportunity.create", upstream:"create_opportunity", risk:"WRITE", purpose:"Create a sales opportunity on a lead.", approval:"configurable" },
  { alias:"close.lead.update", upstream:"update_lead", risk:"HIGH_RISK", purpose:"Update an existing Close lead through the upstream destructive-scope tool set.", approval:"explicit" },
  { alias:"close.task.update", upstream:"update_task", risk:"HIGH_RISK", purpose:"Update an existing Close task through the upstream destructive-scope tool set.", approval:"explicit" }
] as const;

export const BY_ALIAS = new Map(TOOL_POLICIES.map(tool => [tool.alias, tool]));

export function requiredUpstreamScope(risk: Risk): "mcp.read" | "mcp.write_safe" | "mcp.write_destructive" {
  if (risk === "READ") return "mcp.read";
  if (risk === "WRITE") return "mcp.write_safe";
  return "mcp.write_destructive";
}
