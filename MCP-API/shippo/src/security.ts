import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class ApprovalRequiredError extends Error {
  constructor(public readonly tool: string, public readonly risk: Risk) {
    super(`Explicit human approval required for ${tool} (${risk})`);
    this.name = "ApprovalRequiredError";
  }
}

export function authorize(config: Config, tool: string, risk: Risk, approved = false): void {
  if (risk === "DESTRUCTIVE" && !config.allowDestructive) throw new Error(`${tool} is disabled; set SHIPPO_ALLOW_DESTRUCTIVE=true to enable it`);
  const needsApproval = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || config.approvalMode === "all" || (config.approvalMode === "writes" && risk === "WRITE");
  if (needsApproval && !approved) throw new ApprovalRequiredError(tool, risk);
}

export function assertObjectId(value: string, field: string): string {
  const v = value.trim();
  if (!/^([a-zA-Z0-9_-]){1,100}$/.test(v)) throw new Error(`${field} contains invalid characters`);
  return v;
}

export function cleanText(value: string, field: string, max = 500): string {
  const v = value.trim();
  if (!v || v.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(v)) throw new Error(`${field} is invalid`);
  return v;
}
