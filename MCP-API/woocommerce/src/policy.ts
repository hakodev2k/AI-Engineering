export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
import type { Config } from "./config.js";

export function assertAllowed(risk: Risk, toolName: string, args: Record<string, unknown>, config: Config) {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error(`${toolName} is disabled by policy.`);
  if (!config.allowWrites) throw new Error(`${toolName} requires WOOCOMMERCE_ALLOW_WRITES=true.`);
  const provided = args.approvalToken;
  if (!config.approvalToken || typeof provided !== "string" || provided !== config.approvalToken) {
    throw new Error(`${toolName} requires explicit human approval.`);
  }
}
