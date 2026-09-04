export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export type Approval = { confirmed?: boolean; reason?: string };
export type PolicyConfig = { allowWrite: boolean; allowDestructive: boolean; approvalMode: "required" | "disabled" };

export class PolicyError extends Error {
  constructor(message: string) { super(message); this.name = "PolicyError"; }
}

export function assertAllowed(risk: Risk, approval: Approval | undefined, cfg: PolicyConfig): void {
  if (risk === "READ") return;
  if (!cfg.allowWrite) throw new PolicyError("Write operations are disabled. Set LOOPS_ALLOW_WRITE=true only in an approved runtime.");
  if (risk === "DESTRUCTIVE" && !cfg.allowDestructive) {
    throw new PolicyError("Destructive operations are disabled. Set LOOPS_ALLOW_DESTRUCTIVE=true only for an explicitly approved run.");
  }
  if (cfg.approvalMode === "required" && (!approval?.confirmed || !approval.reason?.trim())) {
    throw new PolicyError("Explicit human approval is required with approval.confirmed=true and a non-empty approval.reason.");
  }
}
