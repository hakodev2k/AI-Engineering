import net from "node:net";

export class ValidationError extends Error {}
export class ApprovalError extends Error {}

export function envBool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value == null) return fallback;
  return /^(1|true|yes|on)$/i.test(value);
}

export function requireResearchApproval(approvalId?: string): void {
  if (!envBool("TAVILY_REQUIRE_RESEARCH_APPROVAL", true)) return;
  const expected = process.env.TAVILY_APPROVAL_TOKEN;
  if (!expected) throw new ApprovalError("Research creation requires approval but TAVILY_APPROVAL_TOKEN is not configured.");
  if (!approvalId || approvalId !== expected) throw new ApprovalError("Explicit human approval is required to create a Tavily research task.");
}

function privateIpv4(host: string): boolean {
  const p = host.split(".").map(Number);
  return p[0] === 10 || p[0] === 127 || p[0] === 0 ||
    (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
    (p[0] === 192 && p[1] === 168);
}

export function publicHttpsUrl(value: unknown): string {
  if (typeof value !== "string" || value.length > 2048) throw new ValidationError("URL must be a string of at most 2048 characters.");
  let url: URL;
  try { url = new URL(value); } catch { throw new ValidationError("URL must be absolute."); }
  if (url.protocol !== "https:") throw new ValidationError("Only HTTPS URLs are allowed.");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host === "metadata.google.internal") throw new ValidationError("Local and metadata hosts are not allowed.");
  if (net.isIP(host) === 4 && privateIpv4(host)) throw new ValidationError("Private IPv4 addresses are not allowed.");
  if (net.isIP(host) === 6 && (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80"))) throw new ValidationError("Private IPv6 addresses are not allowed.");
  return url.toString();
}

export function text(value: unknown, field: string, min = 1, max = 2000): string {
  if (typeof value !== "string") throw new ValidationError(`${field} must be a string.`);
  const v = value.trim();
  if (v.length < min || v.length > max) throw new ValidationError(`${field} must contain ${min}-${max} characters.`);
  return v;
}

export function integer(value: unknown, fallback: number, min: number, max: number): number {
  const n = value == null ? fallback : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new ValidationError(`Expected integer between ${min} and ${max}.`);
  return n;
}

export function requestId(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9-]{8,128}$/.test(value)) throw new ValidationError("Invalid research request ID.");
  return value;
}
