export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
import type { Config } from "./config.js";

export function assertAllowed(risk: Risk, tool: string, args: Record<string, unknown>, config: Config) {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error(`${tool} is disabled by connector policy.`);
  if (!config.allowWrites) throw new Error(`${tool} is disabled because BRAINTREE_ALLOW_WRITES is not true.`);
  if (!config.approvalToken || args.approvalToken !== config.approvalToken) {
    throw new Error(`${tool} requires explicit human approval using the connector approval token.`);
  }
}
