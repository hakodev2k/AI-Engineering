export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export class ApprovalError extends Error {}
export class ValidationError extends Error {}

export function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  return raw == null ? fallback : /^(1|true|yes|on)$/i.test(raw);
}

export function requireApproval(risk: Risk, approvalId?: string): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !envBool("NEON_ENABLE_DESTRUCTIVE", false)) {
    throw new ApprovalError("Destructive Neon tools are disabled by default.");
  }
  const required = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || envBool("NEON_REQUIRE_WRITE_APPROVAL", true);
  if (!required) return;
  const expected = process.env.NEON_APPROVAL_TOKEN;
  if (!expected) throw new ApprovalError("Human approval is required but NEON_APPROVAL_TOKEN is not configured.");
  if (!approvalId || approvalId !== expected) throw new ApprovalError("Explicit human approval is required.");
}

export function assertResourceId(value: unknown, field: string): string {
  if (typeof value !== "string" || !/^[a-z0-9-]{1,60}$/.test(value)) throw new ValidationError(`${field} is invalid.`);
  return value;
}

export function assertName(value: unknown, field: string, max = 63): string {
  if (typeof value !== "string" || value.length < 1 || value.length > max || !/^[A-Za-z0-9_. -]+$/.test(value)) throw new ValidationError(`${field} is invalid.`);
  return value;
}

export function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  const n = value == null ? fallback : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new ValidationError(`Expected integer ${min}-${max}.`);
  return n;
}
