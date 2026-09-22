import { z } from "zod";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export type ToolSpec = { external: string; upstream: string; risk: Risk; description: string; schema: z.ZodTypeAny };

const id = z.string().min(1).max(200);
const approved = z.boolean().optional().default(false);

export const tools: ToolSpec[] = [
  { external: "incident-io.incident.list", upstream: "incident_list", risk: "READ", description: "Search and browse incidents.", schema: z.object({ filters: z.record(z.unknown()).optional(), limit: z.number().int().min(1).max(100).optional() }).strict() },
  { external: "incident-io.incident.show", upstream: "incident_show", risk: "READ", description: "Get incident details, optionally including investigation or postmortem.", schema: z.object({ id, include: z.array(z.enum(["investigation","postmortem"])).max(2).optional() }).strict() },
  { external: "incident-io.incident.stats", upstream: "incident_stats", risk: "READ", description: "Aggregate incident counts, trends and workload.", schema: z.object({ filters: z.record(z.unknown()).optional(), group_by: z.array(z.string().min(1)).max(10).optional() }).strict() },
  { external: "incident-io.alert.list", upstream: "alert_list", risk: "READ", description: "Search and browse alerts.", schema: z.object({ filters: z.record(z.unknown()).optional(), limit: z.number().int().min(1).max(100).optional() }).strict() },
  { external: "incident-io.alert.show", upstream: "alert_show", risk: "READ", description: "Get full alert details and linked incidents.", schema: z.object({ id }).strict() },
  { external: "incident-io.alert.stats", upstream: "alert_stats", risk: "READ", description: "Aggregate alert volume and linked incident workload.", schema: z.object({ filters: z.record(z.unknown()).optional(), group_by: z.array(z.string().min(1)).max(10).optional() }).strict() },
  { external: "incident-io.on_call.query", upstream: "ask", risk: "READ", description: "Ask a read-only on-call or schedule question. Mutating requests are rejected locally.", schema: z.object({ question: z.string().min(1).max(2000) }).strict() },
  { external: "incident-io.action.list", upstream: "action_list", risk: "READ", description: "List actions for an incident.", schema: z.object({ incident_id: id }).strict() },
  { external: "incident-io.incident.create", upstream: "incident_create", risk: "WRITE", description: "Declare an incident. Requires explicit approval.", schema: z.object({ name: z.string().min(1).max(500), severity_id: id.optional(), incident_type_id: id.optional(), summary: z.string().max(5000).optional(), approved }).strict() },
  { external: "incident-io.incident.update", upstream: "incident_update", risk: "WRITE", description: "Update an incident. Requires explicit approval.", schema: z.object({ id, updates: z.record(z.unknown()).refine(v => Object.keys(v).length > 0), approved }).strict() },
  { external: "incident-io.action.create", upstream: "action_create", risk: "WRITE", description: "Create an incident action. Requires explicit approval.", schema: z.object({ incident_id: id, description: z.string().min(1).max(5000), assignee_id: id.optional(), approved }).strict() },
  { external: "incident-io.status_page.update.draft", upstream: "status_page_update", risk: "READ", description: "Draft, but never publish, a status-page update.", schema: z.object({ incident_id: id, message: z.string().min(1).max(5000), status: z.string().max(100).optional() }).strict() }
];

const mutatingWords = /\b(acknowledge|override|change|swap|cover|set|create|delete|update|modify|maintenance|snooze|resolve|page|escalate)\b/i;
export function validateLocalPolicy(spec: ToolSpec, args: unknown, allowWrites: boolean): Record<string, unknown> {
  const parsed = spec.schema.parse(args) as Record<string, unknown>;
  if (spec.external === "incident-io.on_call.query" && mutatingWords.test(String(parsed.question))) throw new Error("POLICY_DENIED: on_call.query is read-only");
  if (spec.risk === "WRITE") {
    if (!allowWrites) throw new Error("POLICY_DENIED: writes disabled; set INCIDENT_IO_ALLOW_WRITES=true");
    if (parsed.approved !== true) throw new Error("APPROVAL_REQUIRED: set approved=true after human approval");
    delete parsed.approved;
  }
  return parsed;
}
