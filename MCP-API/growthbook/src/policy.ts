import { timingSafeEqual } from "node:crypto";
import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK";

function same(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

export function authorize(config: Config, risk: Risk, approval?: string): void {
  if (risk === "READ") return;
  if (risk === "HIGH_RISK" && !config.enableHighRisk) throw new Error("HIGH_RISK operations are disabled; set GROWTHBOOK_ENABLE_HIGH_RISK=true explicitly");
  if (!config.requireWriteApproval && risk === "WRITE") return;
  if (!config.approvalSecret) throw new Error("Approval is required but GROWTHBOOK_APPROVAL_SECRET is not configured");
  if (!approval || !same(approval, config.approvalSecret)) throw new Error(`Explicit approval required for ${risk} operation`);
}
