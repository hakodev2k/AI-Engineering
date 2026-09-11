import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK";

export function requireApproval(config: Config, risk: Risk, approvalToken?: string): void {
  if (risk === "READ") return;
  const mandatory = risk === "HIGH_RISK" || config.requireWriteApproval;
  if (!mandatory) return;
  if (!approvalToken || !config.approvalTokens.has(approvalToken)) {
    throw new Error(`APPROVAL_REQUIRED:${risk}`);
  }
}
