import type { Config } from "./config.js";
export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error("Destructive Lever tools are disabled by this connector");
  if (!config.allowWrites) throw new Error("Write tools are disabled; set LEVER_ALLOW_WRITES=true to enable them");
  if (risk === "WRITE" && approval !== "approved" && approval !== "approved-high-risk") throw new Error("Explicit write approval is required");
  if (risk === "HIGH_RISK" && (!config.allowHighRisk || approval !== "approved-high-risk")) throw new Error("Explicit high-risk approval is required");
}
