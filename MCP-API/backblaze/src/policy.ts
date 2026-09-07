import type { BackblazeConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class PolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolicyError";
  }
}

export function assertPolicy(config: BackblazeConfig, risk: Risk, approved: boolean): void {
  if (risk === "READ") return;
  if (!config.allowWrite) throw new PolicyError("Write operations are disabled by configuration");
  if (risk === "DESTRUCTIVE" && !config.allowDestructive) {
    throw new PolicyError("Destructive operations are disabled by configuration");
  }
  if (risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.writeApprovalRequired) {
    if (!approved) throw new PolicyError("Explicit human approval is required for this operation");
  }
}
