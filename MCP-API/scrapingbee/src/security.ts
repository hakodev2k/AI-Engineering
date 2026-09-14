import net from "node:net";

export class ValidationError extends Error {}
export class ApprovalError extends Error {}

export function envBool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  return value == null ? fallback : /^(1|true|yes|on)$/i.test(value);
}

function isPrivateV4(host: string): boolean {
  const p = host.split(".").map(Number);
  return p[0] === 10 || p[0] === 127 || p[0] === 0 ||
    (p[0] === 169 && p[1] === 254) ||
    (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
    (p[0] === 192 && p[1] === 168);
}

export function assertPublicHttpsUrl(raw: unknown): string {
  if (typeof raw !== "string" || raw.length > 4096) throw new ValidationError("url must be a string up to 4096 characters.");
  let url: URL;
  try { url = new URL(raw); } catch { throw new ValidationError("url must be absolute."); }
  if (url.protocol !== "https:") throw new ValidationError("Only HTTPS targets are allowed by this connector.");
  if (url.username || url.password) throw new ValidationError("Credential-bearing target URLs are not allowed.");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host === "metadata.google.internal") throw new ValidationError("Local or metadata hosts are blocked.");
  if (net.isIP(host) === 4 && isPrivateV4(host)) throw new ValidationError("Private/link-local IPv4 targets are blocked.");
  if (net.isIP(host) === 6 && (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80"))) throw new ValidationError("Private/link-local IPv6 targets are blocked.");
  return url.toString();
}

export function boundedString(value: unknown, name: string, max = 500): string {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > max) throw new ValidationError(`${name} must be a non-empty string up to ${max} characters.`);
  return value.trim();
}

export function country(value: unknown): string | undefined {
  if (value == null || value === "") return undefined;
  const v = String(value).toLowerCase();
  if (!/^[a-z]{2}$/.test(v)) throw new ValidationError("countryCode must be a two-letter lowercase ISO country code.");
  return v;
}

export function requireCostApproval(premium: boolean, stealth: boolean, approvalId?: string): void {
  if (!premium && !stealth) return;
  if (!envBool("SCRAPINGBEE_REQUIRE_COST_APPROVAL", true)) return;
  const expected = process.env.SCRAPINGBEE_COST_APPROVAL_TOKEN;
  if (!expected || approvalId !== expected) throw new ApprovalError("Explicit operator approval is required before using premium or stealth proxy credits.");
}

export function assertExtractionRules(value: unknown): Record<string, string | { selector: string; type?: string }> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ValidationError("rules must be an object.");
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length < 1 || entries.length > 30) throw new ValidationError("rules must contain 1-30 fields.");
  const out: Record<string, string | { selector: string; type?: string }> = {};
  for (const [key, rule] of entries) {
    if (!/^[A-Za-z0-9_.-]{1,64}$/.test(key)) throw new ValidationError("Extraction rule keys must be simple field names.");
    if (typeof rule === "string") {
      if (!rule || rule.length > 512) throw new ValidationError("Extraction selectors must be 1-512 characters.");
      out[key] = rule;
    } else if (rule && typeof rule === "object" && !Array.isArray(rule)) {
      const selector = (rule as any).selector;
      const type = (rule as any).type;
      if (typeof selector !== "string" || selector.length < 1 || selector.length > 512) throw new ValidationError("Extraction rule selector is invalid.");
      if (type != null && !["item","list","table"].includes(String(type))) throw new ValidationError("Extraction rule type must be item, list, or table.");
      out[key] = { selector, ...(type ? { type: String(type) } : {}) };
    } else throw new ValidationError("Each extraction rule must be a selector string or a bounded selector object.");
  }
  return out;
}
