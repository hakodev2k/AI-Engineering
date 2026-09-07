import { createHmac, timingSafeEqual } from "node:crypto";
import type { Config } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj).sort().map(k => `${JSON.stringify(k)}:${stable(obj[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function approvalPayload(name: string, args: Record<string, unknown>): string {
  const copy = { ...args };
  delete copy.approvalToken;
  return `${name}\n${stable(copy)}`;
}

export function createApprovalToken(secret: string, name: string, args: Record<string, unknown>): string {
  return createHmac("sha256", secret).update(approvalPayload(name, args)).digest("hex");
}

export function assertAllowed(risk: Risk, name: string, args: Record<string, unknown>, config: Config): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error("Destructive Smartsheet tools are not exposed by this connector.");
  if (risk === "WRITE" && !config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error(`${name} requires SMARTSHEET_APPROVAL_SECRET.`);
  const supplied = typeof args.approvalToken === "string" ? args.approvalToken : "";
  const expected = createApprovalToken(config.approvalSecret, name, args);
  if (!/^[a-f0-9]{64}$/.test(supplied)) throw new Error(`${name} requires explicit human approval.`);
  const a = Buffer.from(supplied, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error(`${name} approval does not match this exact action.`);
}
