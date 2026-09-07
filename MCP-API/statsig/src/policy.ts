import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function assertAllowed(risk: Risk, toolName: string, args: Record<string, unknown>, config: Config): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error(`${toolName} is disabled: destructive actions are not exposed by this connector.`);
  if (!config.allowWrites) throw new Error(`${toolName} is disabled because STATSIG_ALLOW_WRITES is not true.`);
  if (!config.approvalToken || args.approvalToken !== config.approvalToken) {
    throw new Error(`${toolName} requires an explicit human approval token.`);
  }
}
