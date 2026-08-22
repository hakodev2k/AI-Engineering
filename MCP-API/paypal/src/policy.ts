import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { PayPalConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export const TOOL_RISK: Record<string, Risk> = {
  "paypal.invoice.list": "READ",
  "paypal.invoice.get": "READ",
  "paypal.invoice.create": "WRITE",
  "paypal.invoice.send": "HIGH_RISK",
  "paypal.invoice.remind": "HIGH_RISK",
  "paypal.invoice.cancel": "HIGH_RISK",
  "paypal.order.create": "WRITE",
  "paypal.order.get": "READ",
  "paypal.order.capture": "HIGH_RISK",
  "paypal.refund.create": "HIGH_RISK",
  "paypal.refund.get": "READ",
  "paypal.dispute.list": "READ",
  "paypal.dispute.get": "READ",
  "paypal.dispute.accept": "HIGH_RISK"
};

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, canonicalize(child)])
    );
  }
  return value;
}

export function operationTarget(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
}

export function createApprovalToken(secret: string, tool: string, target: string, expiresAt: number): string {
  return createHmac("sha256", secret).update(`${tool}|${target}|${expiresAt}`).digest("base64url");
}

export function assertApproved(
  config: PayPalConfig,
  tool: string,
  target: string,
  approvalToken?: string,
  approvalExpiresAt?: number,
  now = Date.now()
): void {
  const risk = TOOL_RISK[tool] ?? "DESTRUCTIVE";
  if (risk === "READ") return;
  if (risk === "WRITE" && !config.requireWriteApproval) return;
  if (risk === "DESTRUCTIVE") throw new Error(`${tool} is disabled because it is classified as DESTRUCTIVE.`);

  const maxExpiry = now + 5 * 60_000;
  if (!config.approvalSecret || !approvalToken || !approvalExpiresAt) {
    throw new Error(`Approval required for ${tool}; target=${target}; expiresAt must be between ${now + 1000} and ${maxExpiry}.`);
  }
  if (approvalExpiresAt <= now || approvalExpiresAt > maxExpiry) {
    throw new Error("Approval expired or exceeds the 5-minute maximum approval window.");
  }

  const expected = Buffer.from(createApprovalToken(config.approvalSecret, tool, target, approvalExpiresAt));
  const actual = Buffer.from(approvalToken);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new Error("Invalid approval token for this exact PayPal operation.");
  }
}
