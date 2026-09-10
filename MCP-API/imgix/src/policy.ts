export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class PolicyError extends Error {
  constructor(message: string) { super(message); this.name = "PolicyError"; }
}

export function requirePermission(risk: Risk, approved = false, env = process.env): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (env.IMGIX_ALLOW_WRITE !== "true") throw new PolicyError("WRITE operations are disabled. Set IMGIX_ALLOW_WRITE=true explicitly.");
    return;
  }
  if (risk === "HIGH_RISK") {
    if (env.IMGIX_ALLOW_HIGH_RISK !== "true") throw new PolicyError("HIGH_RISK operations are disabled. Set IMGIX_ALLOW_HIGH_RISK=true explicitly.");
    if (!approved) throw new PolicyError("Explicit human approval is required for this HIGH_RISK operation.");
    return;
  }
  throw new PolicyError("DESTRUCTIVE operations are not implemented by this connector.");
}
