import type { CopperConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(risk: Risk, approval: string | undefined, config: CopperConfig): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error("Destructive Copper operations are disabled by this connector");
  if (!config.allowWrites) throw new Error("Write operations are disabled; set COPPER_ALLOW_WRITES=true explicitly");
  if (risk === "WRITE" && approval !== "approved" && approval !== "approved-high-risk") {
    throw new Error("This write operation requires approval='approved'");
  }
  if (risk === "HIGH_RISK") {
    if (!config.allowHighRisk) throw new Error("High-risk operations are disabled; set COPPER_ALLOW_HIGH_RISK=true explicitly");
    if (approval !== "approved-high-risk") throw new Error("This operation requires approval='approved-high-risk'");
  }
}
