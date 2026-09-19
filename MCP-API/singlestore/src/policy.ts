export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export interface PolicyConfig {
  approveWrites: boolean;
  approveHighRisk: boolean;
  allowDestructive: boolean;
}

export class ApprovalRequiredError extends Error {}
export class PermissionDeniedError extends Error {}

export function assertAllowed(risk: Risk, approved: boolean, policy: PolicyConfig): void {
  if (risk === "READ") return;
  if (risk === "WRITE" && policy.approveWrites && !approved) throw new ApprovalRequiredError("Explicit approval is required for write operations");
  if (risk === "HIGH_RISK" && (!policy.approveHighRisk || !approved)) throw new ApprovalRequiredError("Explicit approval is required for high-risk operations");
  if (risk === "DESTRUCTIVE") {
    if (!policy.allowDestructive) throw new PermissionDeniedError("Destructive operations are disabled");
    if (!approved) throw new ApprovalRequiredError("Explicit approval is required for destructive operations");
  }
}
