import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
const rank: Record<Config["permission"], number> = { read: 0, write: 1, "high-risk": 2 };
const required: Record<Risk, number> = { READ: 0, WRITE: 1, HIGH_RISK: 2, DESTRUCTIVE: 3 };

export function assertAllowed(risk: Risk, tool: string, args: Record<string, unknown>, config: Config): void {
  if (risk === "DESTRUCTIVE") throw new Error(`${tool} is disabled by connector policy.`);
  if (rank[config.permission] < required[risk]) throw new Error(`${tool} requires ${risk} permission.`);
  const approved = args.approved === true;
  if (risk === "WRITE" && config.requireWriteApproval && !approved) throw new Error(`${tool} requires explicit approval.`);
  if (risk === "HIGH_RISK" && config.requireHighRiskApproval && !approved) throw new Error(`${tool} requires explicit high-risk approval.`);
}
