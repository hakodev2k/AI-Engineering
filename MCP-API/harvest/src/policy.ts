import { timingSafeEqual } from "node:crypto";
import type { HarvestConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

function equalSecret(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function assertAllowed(risk: Risk, toolName: string, args: Record<string, unknown>, config: HarvestConfig): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error(`${toolName} is disabled: destructive Harvest operations are not exposed.`);
  if (!config.allowWrites) throw new Error(`${toolName} is disabled because HARVEST_ALLOW_WRITES is not true.`);
  if (!config.approvalToken) throw new Error(`${toolName} requires connector-side human approval configuration.`);
  const provided = typeof args.approvalToken === "string" ? args.approvalToken : "";
  if (!provided || !equalSecret(provided, config.approvalToken)) throw new Error(`${toolName} requires a valid explicit human approval token.`);
}
