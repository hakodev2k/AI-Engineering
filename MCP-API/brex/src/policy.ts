export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export interface ToolPolicy {
  risk: Risk;
  approvalRequired: boolean;
  permission: string;
}

export function enforcePolicy(policy: ToolPolicy, approval?: string): void {
  if (policy.risk === "DESTRUCTIVE") throw new Error("Destructive Brex operations are disabled by this connector");
  if (policy.approvalRequired && approval !== "approved" && approval !== "approved-high-risk") {
    throw new Error(`Human approval required for ${policy.risk} operation`);
  }
}
