import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error("Destructive Persona operations are disabled by this connector");
  if (risk === "WRITE") {
    if (!config.allowWrites) throw new Error("Write operations are disabled; set PERSONA_ALLOW_WRITES=true intentionally");
    if (approval !== "approved" && approval !== "approved-high-risk") throw new Error("Explicit human approval is required for this write operation");
    return;
  }
  if (!config.allowHighRisk) throw new Error("High-risk operations are disabled; set PERSONA_ALLOW_HIGH_RISK=true intentionally");
  if (approval !== "approved-high-risk") throw new Error("Explicit high-risk human approval is required");
}
