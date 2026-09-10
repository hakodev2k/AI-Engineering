import crypto from "node:crypto";
import type { Config } from "./config.js";

export type Risk = "READ" | "HIGH_RISK";
export const TOOLS = {
  "planetscale.organization.list": { upstream: "planetscale_list_organizations", risk: "READ" },
  "planetscale.organization.get": { upstream: "planetscale_get_organization", risk: "READ" },
  "planetscale.database.list": { upstream: "planetscale_list_databases", risk: "READ" },
  "planetscale.database.get": { upstream: "planetscale_get_database", risk: "READ" },
  "planetscale.branch.list": { upstream: "planetscale_list_branches", risk: "READ" },
  "planetscale.branch.get": { upstream: "planetscale_get_branch", risk: "READ" },
  "planetscale.branch.schema": { upstream: "planetscale_get_branch_schema", risk: "READ" },
  "planetscale.insights.get": { upstream: "planetscale_get_insights", risk: "READ" },
  "planetscale.schema_recommendation.list": { upstream: "planetscale_list_schema_recommendations", risk: "READ" },
  "planetscale.query_tag.list": { upstream: "planetscale_list_query_tags", risk: "READ" },
  "planetscale.query_tag.get": { upstream: "planetscale_get_query_tag", risk: "READ" },
  "planetscale.query_tag.summary": { upstream: "planetscale_list_query_tag_summaries", risk: "READ" },
  "planetscale.postgres.logs": { upstream: "planetscale_get_postgres_logs", risk: "READ" },
  "planetscale.query.read": { upstream: "planetscale_execute_read_query", risk: "READ" },
  "planetscale.query.write": { upstream: "planetscale_execute_write_query", risk: "HIGH_RISK" }
} as const satisfies Record<string, { upstream: string; risk: Risk }>;

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${stable(v)}`).join(",")}}`;
  return JSON.stringify(value);
}

export function authorize(config: Config, tool: keyof typeof TOOLS, args: Record<string, unknown>) {
  if (TOOLS[tool].risk === "READ") return;
  if (!config.enableWrite) throw new Error("PlanetScale write tools are disabled");
  if (!config.PLANETSCALE_APPROVAL_SECRET) throw new Error("Approval secret is not configured");
  const token = String(args.approvalToken ?? "");
  const payload = { ...args }; delete payload.approvalToken;
  const expected = crypto.createHmac("sha256", config.PLANETSCALE_APPROVAL_SECRET).update(`${tool}\n${stable(payload)}`).digest("hex");
  const a = Buffer.from(token); const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) throw new Error("Explicit approval is required for this exact write query");
}
