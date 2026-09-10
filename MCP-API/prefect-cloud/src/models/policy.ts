import { timingSafeEqual } from "node:crypto";
import type { ConnectorConfig } from "../config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class ApprovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApprovalError";
  }
}

export function requireApproval(
  config: ConnectorConfig,
  risk: Risk,
  suppliedToken?: string,
): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new ApprovalError("Destructive tools are disabled by this connector");
  if (!config.approvalToken) throw new ApprovalError("Server-side approval token is not configured");
  if (!suppliedToken) throw new ApprovalError("Explicit human approval is required");
  const expected = Buffer.from(config.approvalToken);
  const supplied = Buffer.from(suppliedToken);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    throw new ApprovalError("Approval token is invalid");
  }
}

export function requireExecutionEnabled(config: ConnectorConfig): void {
  if (!config.enableExecution) {
    throw new ApprovalError("Execution tools are disabled; set PREFECT_ENABLE_EXECUTION=true on the connector host");
  }
}
