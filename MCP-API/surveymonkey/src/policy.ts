import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function assertAllowed(risk: Risk, toolName: string, args: Record<string, unknown>, config: Config): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error(`${toolName} is destructive and disabled by this connector.`);
  if (!config.allowWrites) throw new Error(`${toolName} is disabled because SURVEYMONKEY_ALLOW_WRITES is not true.`);
  if (!config.approvalToken) throw new Error(`${toolName} requires connector-side human approval configuration.`);
  if (args.approvalToken !== config.approvalToken) throw new Error(`${toolName} requires explicit human approval.`);
}
