export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export class ApprovalError extends Error {}
export class ValidationError extends Error {}

export function envBool(name:string, fallback:boolean):boolean {
  const v=process.env[name]; return v == null ? fallback : /^(1|true|yes|on)$/i.test(v);
}
export function requireApproval(risk:Risk, approvalId?:string):void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !envBool("INNGEST_ENABLE_DESTRUCTIVE", false)) throw new ApprovalError("Destructive tools are disabled.");
  const required = risk === "HIGH_RISK" || risk === "DESTRUCTIVE" || envBool("INNGEST_REQUIRE_WRITE_APPROVAL", true);
  if (!required) return;
  const expected=process.env.INNGEST_APPROVAL_TOKEN;
  if (!expected || !approvalId || approvalId !== expected) throw new ApprovalError("Explicit human approval is required for this operation.");
}
export function id(value:unknown, field:string):string {
  if (typeof value !== "string" || value.length < 1 || value.length > 200 || !/^[A-Za-z0-9_:.\/-]+$/.test(value)) throw new ValidationError(`${field} is invalid.`);
  return value;
}
export function cursor(value:unknown):string|undefined {
  if (value == null || value === "") return undefined;
  if (typeof value !== "string" || value.length > 1000) throw new ValidationError("cursor is invalid.");
  return value;
}
export function limit(value:unknown, max=100):number {
  const n=value == null ? 20 : Number(value); if (!Number.isInteger(n) || n<1 || n>max) throw new ValidationError(`limit must be 1-${max}.`); return n;
}
export function plainObject(value:unknown, field:string, maxBytes=100_000):Record<string,unknown> {
  if (value == null) return {};
  if (typeof value !== "object" || Array.isArray(value)) throw new ValidationError(`${field} must be an object.`);
  if (Buffer.byteLength(JSON.stringify(value),"utf8") > maxBytes) throw new ValidationError(`${field} is too large.`);
  return value as Record<string,unknown>;
}
export function iso(value:unknown, field:string):string|undefined {
  if (value == null || value === "") return undefined;
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) throw new ValidationError(`${field} must be an ISO date-time.`);
  return new Date(value).toISOString();
}
