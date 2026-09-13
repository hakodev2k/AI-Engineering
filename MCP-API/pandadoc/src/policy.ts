import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (!config.allowWrites) throw new Error("WRITE tools are disabled; set PANDADOC_ALLOW_WRITES=true");
    if (approval !== "approved" && approval !== "approved-high-risk") throw new Error("Explicit approval is required for WRITE tools");
    return;
  }
  if (risk === "HIGH_RISK") {
    if (!config.allowHighRisk) throw new Error("HIGH_RISK tools are disabled; set PANDADOC_ALLOW_HIGH_RISK=true");
    if (approval !== "approved-high-risk") throw new Error("Explicit high-risk approval is required");
    return;
  }
  throw new Error("DESTRUCTIVE operations are not exposed by this connector");
}
