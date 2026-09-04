export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export type Approval = { confirmed?: boolean; reason?: string };

export type PolicyConfig = {
  readOnly: boolean;
  allowWrite: boolean;
  approvalMode: "required" | "disabled";
};

export class PolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolicyError";
  }
}

export function assertAllowed(risk: Risk, approval: Approval | undefined, cfg: PolicyConfig): void {
  if (risk === "READ") return;
  if (cfg.readOnly) throw new PolicyError("Write operations are disabled because PUSHER_READ_ONLY=true.");
  if (!cfg.allowWrite) throw new PolicyError("Write operations are disabled because PUSHER_ALLOW_WRITE=false.");
  if (risk === "DESTRUCTIVE") throw new PolicyError("Destructive operations are disabled by this connector.");
  if (cfg.approvalMode === "required" && (!approval?.confirmed || !approval.reason?.trim())) {
    throw new PolicyError("Explicit human approval is required with approval.confirmed=true and a non-empty approval.reason.");
  }
}
