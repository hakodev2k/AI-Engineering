import type { HelpScoutConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class PolicyError extends Error {}

export function requirePermission(config: HelpScoutConfig, risk: Risk, confirmation?: string): void {
  if (risk === "READ") return;
  if (!config.allowWrite) throw new PolicyError("Write operations are disabled by HELPSCOUT_ALLOW_WRITE");
  if (risk === "WRITE") {
    if (config.requireWriteApproval && confirmation !== "APPROVE_WRITE") {
      throw new PolicyError("Explicit write approval is required (confirmation=APPROVE_WRITE)");
    }
    return;
  }
  if (risk === "HIGH_RISK") {
    if (!config.allowHighRisk) throw new PolicyError("High-risk operations are disabled by HELPSCOUT_ALLOW_HIGH_RISK");
    if (confirmation !== "APPROVE_HIGH_RISK") throw new PolicyError("Explicit high-risk approval is required (confirmation=APPROVE_HIGH_RISK)");
    return;
  }
  throw new PolicyError("Destructive operations are disabled by this connector");
}

export function assertSafeWebhookUrl(raw: string): void {
  const url = new URL(raw);
  if (url.protocol !== "https:") throw new PolicyError("Webhook URL must use HTTPS");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" || host === "::1") {
    throw new PolicyError("Webhook URL may not target localhost/private development hosts");
  }
  if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) {
    throw new PolicyError("Webhook URL may not target private/link-local IPv4 ranges");
  }
  const m = host.match(/^172\.(\d+)\./);
  if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) throw new PolicyError("Webhook URL may not target private IPv4 ranges");
}
