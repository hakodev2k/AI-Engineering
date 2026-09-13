import type { KindeConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK";
export class ApprovalError extends Error {}

export function requireApproval(risk: Risk, approval: string | undefined, config: KindeConfig): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (!config.allowWrites) throw new ApprovalError("Write tools are disabled. Set KINDE_ALLOW_WRITES=true after operator review.");
    if (approval !== "approved") throw new ApprovalError("Explicit approval='approved' is required for this write operation.");
    return;
  }
  if (!config.allowHighRisk) throw new ApprovalError("High-risk tools are disabled. Set KINDE_ALLOW_HIGH_RISK=true after operator review.");
  if (approval !== "approved-high-risk") throw new ApprovalError("Explicit approval='approved-high-risk' is required.");
}
