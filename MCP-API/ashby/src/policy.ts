import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error("Destructive tools are disabled by this connector");
  if (!config.allowWrites) throw new Error("Write tools are disabled; set ASHBY_ALLOW_WRITES=true to enable them");
  if (risk === "WRITE" && approval !== "approved" && approval !== "approved-high-risk") {
    throw new Error("Explicit approval is required for this write operation");
  }
  if (risk === "HIGH_RISK") {
    if (!config.allowHighRisk) throw new Error("High-risk tools are disabled; set ASHBY_ALLOW_HIGH_RISK=true to enable them");
    if (approval !== "approved-high-risk") throw new Error("Explicit high-risk approval is required");
  }
}

export function rejectPrivateFieldsRequested(input: Record<string, unknown>, config: Config): void {
  if (config.allowPrivateFields) return;
  const text = JSON.stringify(input).toLowerCase();
  if (text.includes("private") || text.includes("confidential")) {
    throw new Error("Private/confidential field access is disabled by default");
  }
}
