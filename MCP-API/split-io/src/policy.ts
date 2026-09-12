import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error("Destructive operations are disabled by this connector");
  if (risk === "WRITE") {
    if (!config.allowWrites) throw new Error("Write operations are disabled; set SPLIT_ALLOW_WRITES=true");
    if (approval !== "approved" && approval !== "approved-high-risk") throw new Error("Explicit approval is required for write operations");
    return;
  }
  if (!config.allowHighRisk) throw new Error("High-risk operations are disabled; set SPLIT_ALLOW_HIGH_RISK=true");
  if (approval !== "approved-high-risk") throw new Error("Explicit high-risk approval is required");
}
