import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import { requireApproval, type Risk } from "./policy.js";
import type { Upstream } from "./upstream.js";

export interface ToolSpec { name: string; upstream: string; description: string; risk: Risk; }

export const TOOL_SPECS: ToolSpec[] = [
  { name: "incidentio.incident.list", upstream: "incident_list", description: "Search and browse incidents.", risk: "READ" },
  { name: "incidentio.incident.show", upstream: "incident_show", description: "Read full incident details, optionally including investigation and post-mortem data.", risk: "READ" },
  { name: "incidentio.incident.stats", upstream: "incident_stats", description: "Aggregate incident counts and responder workload.", risk: "READ" },
  { name: "incidentio.incident.create", upstream: "incident_create", description: "Create an incident.", risk: "WRITE" },
  { name: "incidentio.incident.update", upstream: "incident_update", description: "Update an incident's supported fields.", risk: "WRITE" },
  { name: "incidentio.alert.list", upstream: "alert_list", description: "Search and browse alerts.", risk: "READ" },
  { name: "incidentio.alert.show", upstream: "alert_show", description: "Read an alert and linked incident details.", risk: "READ" },
  { name: "incidentio.alert.stats", upstream: "alert_stats", description: "Aggregate alert volume and linked incident workload.", risk: "READ" },
  { name: "incidentio.schedule.list", upstream: "schedule_list", description: "List on-call schedules.", risk: "READ" },
  { name: "incidentio.schedule.show", upstream: "schedule_show", description: "Read schedule details and current/upcoming shifts.", risk: "READ" },
  { name: "incidentio.team.list", upstream: "team_list", description: "List teams.", risk: "READ" },
  { name: "incidentio.team.show", upstream: "team_show", description: "Read team ownership, escalation paths, alert sources and schedules.", risk: "READ" },
  { name: "incidentio.escalation.list", upstream: "escalation_list", description: "Search paging escalations.", risk: "READ" },
  { name: "incidentio.escalation.show", upstream: "escalation_show", description: "Read escalation details and transition history.", risk: "READ" },
  { name: "incidentio.escalation.respond", upstream: "escalation_respond", description: "Acknowledge or decline a page. Requires explicit high-risk approval.", risk: "HIGH_RISK" },
  { name: "incidentio.follow_up.list", upstream: "follow_up_list", description: "List post-incident follow-ups.", risk: "READ" },
  { name: "incidentio.follow_up.create", upstream: "follow_up_create", description: "Create a follow-up on an incident.", risk: "WRITE" }
];

const inputShape = {
  params: z.record(z.unknown()).default({}).describe("Arguments forwarded only to the fixed allowlisted upstream incident.io tool and validated against its live MCP input schema."),
  approval: z.enum(["approved", "approved-high-risk"]).optional().describe("Required only for WRITE/HIGH_RISK operations.")
};

function safeJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "string" && item.length > 200_000 ? `${item.slice(0, 200_000)}…[truncated]` : item, 2);
}

export async function executeTool(spec: ToolSpec, params: Record<string, unknown>, approval: string | undefined, upstream: Upstream, config: Config): Promise<unknown> {
  requireApproval(spec.risk, approval, config);
  return upstream.callTool(spec.upstream, params);
}

export function registerTools(server: McpServer, upstream: Upstream, config: Config): void {
  for (const spec of TOOL_SPECS) {
    server.tool(spec.name, spec.description, inputShape, async ({ params, approval }) => {
      const result = await executeTool(spec, params, approval, upstream, config);
      return { content: [{ type: "text", text: safeJson({ provider: "incident.io", tool: spec.name, risk: spec.risk, untrusted_provider_content: true, result }) }] };
    });
  }
}
