import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK";

export class ApprovalError extends Error {}

export function requireApproval(risk: Risk, approval: string | undefined, config: Config): void {
  if (risk === "READ") return;
  if (risk === "WRITE") {
    if (!config.writeApproved || approval !== "approved") {
      throw new ApprovalError("WRITE requires INCIDENTIO_WRITE_APPROVED=true and approval='approved'");
    }
    return;
  }
  if (!config.highRiskApproved || approval !== "approved-high-risk") {
    throw new ApprovalError("HIGH_RISK requires INCIDENTIO_HIGH_RISK_APPROVED=true and approval='approved-high-risk'");
  }
}
