import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (!config.allowWrites) throw new Error("Write operations are disabled. Set ONFLEET_ALLOW_WRITES=true to enable them.");
  if (risk === "WRITE" && approval !== "approved") throw new Error("Explicit approval='approved' is required.");
  if ((risk === "HIGH_RISK" || risk === "DESTRUCTIVE")) {
    if (!config.allowHighRisk) throw new Error("High-risk/destructive operations are disabled. Set ONFLEET_ALLOW_HIGH_RISK=true to enable them.");
    if (approval !== "approved-high-risk") throw new Error("Explicit approval='approved-high-risk' is required.");
  }
}
