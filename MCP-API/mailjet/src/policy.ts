import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export class ApprovalError extends Error { constructor(message="Human approval is required") { super(message); this.name="ApprovalError"; } }

export function enforce(risk: Risk, approved: boolean | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !config.enableDestructive) throw new ApprovalError("Destructive tools are disabled by configuration");
  if (risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval) {
    if (approved !== true) throw new ApprovalError();
  }
}
