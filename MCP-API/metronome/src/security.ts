export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export class ValidationError extends Error {}
export class ApprovalError extends Error {}

export function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  return raw == null ? fallback : /^(1|true|yes|on)$/i.test(raw);
}

export function requireApproval(risk: Risk, approvalId?: string): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !envBool("METRONOME_ENABLE_DESTRUCTIVE", false)) {
    throw new ApprovalError("Destructive tools are disabled by default.");
  }
  const required = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || envBool("METRONOME_REQUIRE_WRITE_APPROVAL", true);
  if (!required) return;
  const expected = process.env.METRONOME_APPROVAL_TOKEN;
  if (!expected || approvalId !== expected) throw new ApprovalError("Explicit human approval is required.");
}

export function boundedInt(value: unknown, fallback: number, min: number, max: number): number {
  const n = value == null ? fallback : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new ValidationError(`Expected integer ${min}-${max}.`);
  return n;
}

export function nonEmpty(value: unknown, field: string, max = 256): string {
  if (typeof value !== "string" || value.length < 1 || value.length > max) throw new ValidationError(`${field} must be 1-${max} characters.`);
  return value;
}

export function uuid(value: unknown, field: string): string {
  const s = nonEmpty(value, field, 64);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)) throw new ValidationError(`${field} must be a UUID.`);
  return s;
}

export function isoDate(value: unknown, field: string): string {
  const s = nonEmpty(value, field, 64);
  if (!Number.isFinite(Date.parse(s))) throw new ValidationError(`${field} must be RFC 3339/ISO-8601.`);
  return new Date(s).toISOString();
}

export function idempotencyKey(value: unknown): string | undefined {
  if (value == null) return undefined;
  return nonEmpty(value, "idempotencyKey", 128);
}
