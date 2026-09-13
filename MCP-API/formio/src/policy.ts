import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (!config.allowWrites || approval !== "approved") throw new Error("WRITE_DENIED: enable FORMIO_ALLOW_WRITES and pass approval=approved");
    return;
  }
  if (risk === "HIGH_RISK") {
    if (!config.allowHighRisk || approval !== "approved-high-risk") throw new Error("HIGH_RISK_DENIED: enable FORMIO_ALLOW_HIGH_RISK and pass approval=approved-high-risk");
    return;
  }
  if (!config.allowDestructive || approval !== "approved-destructive") throw new Error("DESTRUCTIVE_DENIED: destructive tools are disabled by default; enable FORMIO_ALLOW_DESTRUCTIVE and pass approval=approved-destructive");
}
