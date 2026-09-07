import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function assertAllowed(risk: Risk, args: Record<string, unknown>, config: Config): void {
  if (risk === "READ") return;
  if (!config.allowWrites) throw new Error("Clockify write tools are disabled by connector policy.");
  if (risk === "DESTRUCTIVE" && !config.allowDestructive) throw new Error("Clockify destructive tools are disabled by connector policy.");
  const supplied = typeof args.approvalToken === "string" ? args.approvalToken : undefined;
  if (!config.approvalToken || supplied !== config.approvalToken) throw new Error("Explicit human approval is required for this Clockify tool.");
}
