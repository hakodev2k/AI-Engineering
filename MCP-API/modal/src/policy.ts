import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class ApprovalRequiredError extends Error {
  constructor(public readonly risk: Risk) {
    super(`Explicit approval is required for ${risk} operation.`);
    this.name = "ApprovalRequiredError";
  }
}

export class DestructiveDisabledError extends Error {
  constructor() {
    super("Destructive operations are disabled. Set MODAL_ALLOW_DESTRUCTIVE=true and approve explicitly to enable them.");
    this.name = "DestructiveDisabledError";
  }
}

export function enforcePolicy(config: Config, risk: Risk, approved = false): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !config.allowDestructive) throw new DestructiveDisabledError();
  if ((risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval) && !approved) {
    throw new ApprovalRequiredError(risk);
  }
}
