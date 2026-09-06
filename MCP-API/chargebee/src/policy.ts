import type { Config } from "./config.js";
export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export function assertAllowed(risk: Risk, tool: string, args: Record<string, unknown>, config: Config) {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error(`${tool} is disabled: destructive operations are not exposed.`);
  if (!config.allowWrites) throw new Error(`${tool} requires CHARGEBEE_ALLOW_WRITES=true.`);
  if (!config.approvalToken) throw new Error(`${tool} requires connector-side approval configuration.`);
  if (args.approvalToken !== config.approvalToken) throw new Error(`${tool} requires explicit human approval.`);
}
