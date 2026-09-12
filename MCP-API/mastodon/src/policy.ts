import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (!config.allowWrites) throw new Error("WRITE operations are disabled by configuration");
    if (approval !== "approved" && approval !== "approved-high-risk" && approval !== "approved-destructive") throw new Error("Explicit approval is required");
    return;
  }
  if (risk === "HIGH_RISK") {
    if (!config.allowHighRisk) throw new Error("HIGH_RISK operations are disabled by configuration");
    if (approval !== "approved-high-risk" && approval !== "approved-destructive") throw new Error("Explicit high-risk approval is required");
    return;
  }
  if (!config.allowDestructive) throw new Error("DESTRUCTIVE operations are disabled by configuration");
  if (approval !== "approved-destructive") throw new Error("Explicit destructive approval is required");
}
