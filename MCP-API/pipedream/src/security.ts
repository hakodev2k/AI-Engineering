export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export class ValidationError extends Error {}
export class ApprovalError extends Error {}

export function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw == null) return fallback;
  return /^(1|true|yes|on)$/i.test(raw);
}

export function requireApproval(risk: Risk, approvalId?: unknown): void {
  if (risk === "READ") return;
  const required = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || envBool("PIPEDREAM_REQUIRE_WRITE_APPROVAL", true);
  if (!required) return;
  const expected = process.env.PIPEDREAM_APPROVAL_TOKEN;
  if (!expected) throw new ApprovalError("Human approval is required but PIPEDREAM_APPROVAL_TOKEN is not configured.");
  if (typeof approvalId !== "string" || approvalId !== expected) throw new ApprovalError("Explicit human approval is required for this operation.");
}

export function text(value: unknown, field: string, max = 256): string {
  if (typeof value !== "string" || value.length < 1 || value.length > max || /[\u0000-\u001f]/.test(value)) {
    throw new ValidationError(`${field} must be a non-empty string up to ${max} characters without control characters.`);
  }
  return value;
}

export function limit(value: unknown, fallback = 25): number {
  const n = value == null ? fallback : Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 100) throw new ValidationError("limit must be an integer from 1 to 100.");
  return n;
}

export function boundedObject(value: unknown, field: string, maxKeys = 50): Record<string, unknown> {
  if (value == null) return {};
  if (typeof value !== "object" || Array.isArray(value)) throw new ValidationError(`${field} must be an object.`);
  const obj = value as Record<string, unknown>;
  if (Object.keys(obj).length > maxKeys) throw new ValidationError(`${field} has too many keys.`);
  const encoded = JSON.stringify(obj);
  if (encoded.length > 64_000) throw new ValidationError(`${field} is too large.`);
  if (/(client_secret|access_token|refresh_token|api[_-]?key|password)/i.test(encoded)) {
    throw new ValidationError(`${field} appears to contain credentials; secrets must remain in the connector credential layer.`);
  }
  return obj;
}
