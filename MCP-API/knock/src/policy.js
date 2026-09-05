export class PolicyError extends Error {
  constructor(message) { super(message); this.name = "PolicyError"; }
}
export function assertAllowed(risk, approval, requireWriteApproval) {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new PolicyError("Destructive operations are not exposed by this connector.");
  const required = risk === "HIGH_RISK" || requireWriteApproval;
  if (required && (!approval?.confirmed || typeof approval.reason !== "string" || approval.reason.trim().length < 3)) {
    throw new PolicyError("Explicit human approval is required with approval.confirmed=true and a non-empty approval.reason.");
  }
}
