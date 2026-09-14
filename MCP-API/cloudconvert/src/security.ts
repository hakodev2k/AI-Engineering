import net from "node:net";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class ApprovalError extends Error {}
export class ValidationError extends Error {}

export function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw == null) return fallback;
  return /^(1|true|yes|on)$/i.test(raw);
}

export function requireApproval(risk: Risk, approvalId?: string): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !envBool("CLOUDCONVERT_ENABLE_DESTRUCTIVE", false)) {
    throw new ApprovalError("Destructive tools are disabled. Set CLOUDCONVERT_ENABLE_DESTRUCTIVE=true only after operator review.");
  }
  const required = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || envBool("CLOUDCONVERT_REQUIRE_WRITE_APPROVAL", true);
  if (!required) return;
  const expected = process.env.CLOUDCONVERT_APPROVAL_TOKEN;
  if (!expected) throw new ApprovalError("Human approval is required but CLOUDCONVERT_APPROVAL_TOKEN is not configured.");
  if (!approvalId || approvalId !== expected) throw new ApprovalError("Explicit human approval is required for this operation.");
}

function isPrivateIpv4(ip: string): boolean {
  const p = ip.split(".").map(Number);
  return p[0] === 10 || p[0] === 127 || (p[0] === 169 && p[1] === 254) ||
    (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || p[0] === 0;
}

export function assertPublicHttpsUrl(value: string): string {
  let url: URL;
  try { url = new URL(value); } catch { throw new ValidationError("A valid absolute URL is required."); }
  if (url.protocol !== "https:") throw new ValidationError("Only HTTPS URLs are allowed.");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host === "metadata.google.internal") {
    throw new ValidationError("Local or metadata-service hosts are not allowed.");
  }
  if (net.isIP(host) === 4 && isPrivateIpv4(host)) throw new ValidationError("Private IPv4 addresses are not allowed.");
  if (net.isIP(host) === 6 && (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80"))) {
    throw new ValidationError("Private or link-local IPv6 addresses are not allowed.");
  }
  return url.toString();
}

export function assertId(value: unknown, field = "id"): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9-]{1,128}$/.test(value)) throw new ValidationError(`${field} is invalid.`);
  return value;
}

export function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  const n = value == null ? fallback : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new ValidationError(`Expected an integer between ${min} and ${max}.`);
  return n;
}
