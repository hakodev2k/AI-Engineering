import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
const consumed = new Set<string>();

export function authorize(config: Config, risk: Risk, approvalId?: string): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !config.enableDestructive) throw new Error("DESTRUCTIVE operations are disabled");
  const required = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.requireWriteApproval;
  if (!required) return;
  if (!approvalId || !config.approvedActionIds.has(approvalId)) throw new Error(`${risk} operation requires explicit human approval`);
  if (consumed.has(approvalId)) throw new Error("Approval token has already been consumed");
  consumed.add(approvalId);
}

export function resetConsumedApprovalsForTests(): void { consumed.clear(); }
