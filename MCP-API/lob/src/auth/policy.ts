import type { LobConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class ApprovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApprovalError";
  }
}

export function requirePermission(config: LobConfig, risk: Risk, approvalToken?: string): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !config.enableDestructive) {
    throw new ApprovalError("Destructive Lob tools are disabled. Set LOB_ENABLE_DESTRUCTIVE=true and provide explicit approval.");
  }
  const approvalRequired = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval;
  if (!approvalRequired) return;
  if (!config.approvalToken) {
    throw new ApprovalError("Approval is required but LOB_APPROVAL_TOKEN is not configured.");
  }
  if (!approvalToken || approvalToken !== config.approvalToken) {
    throw new ApprovalError("Explicit human approval is required for this Lob operation.");
  }
}
