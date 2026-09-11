import type { StatusCakeConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export interface ApprovalContext {
  approved?: boolean;
}

export function enforceRisk(config: StatusCakeConfig, risk: Risk, approval: ApprovalContext): void {
  if (risk === "READ") return;
  if (risk === "WRITE" && !config.requireWriteApproval) return;
  if (risk === "DESTRUCTIVE" && !config.enableDestructive) {
    throw new Error("DESTRUCTIVE operations are disabled; set STATUSCAKE_ENABLE_DESTRUCTIVE=true and provide explicit approval");
  }
  if (!approval.approved) throw new Error(`${risk} operation requires explicit human approval`);
}
