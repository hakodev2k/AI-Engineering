import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK";

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (!config.allowWrites) throw new Error("WRITE operations are disabled by configuration");
    if (approval !== "approved" && approval !== "approved-high-risk") {
      throw new Error("WRITE operation requires explicit approval");
    }
    return;
  }
  if (!config.allowHighRisk) throw new Error("HIGH_RISK operations are disabled by configuration");
  if (approval !== "approved-high-risk") {
    throw new Error("HIGH_RISK operation requires explicit high-risk approval");
  }
}
