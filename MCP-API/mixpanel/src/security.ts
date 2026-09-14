export class ValidationError extends Error {}

export function assertDate(value: unknown, field: string): string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new ValidationError(`${field} must be YYYY-MM-DD.`);
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.valueOf()) || d.toISOString().slice(0,10) !== value) throw new ValidationError(`${field} is not a real date.`);
  return value;
}

export function assertDateRange(from: unknown, to: unknown, maxDays = 31): { from: string; to: string } {
  const f = assertDate(from, "fromDate"); const t = assertDate(to, "toDate");
  const ms = new Date(`${t}T00:00:00Z`).valueOf() - new Date(`${f}T00:00:00Z`).valueOf();
  if (ms < 0) throw new ValidationError("toDate must be on or after fromDate.");
  if (ms / 86400000 > maxDays) throw new ValidationError(`Date range exceeds ${maxDays} days.`);
  return { from:f, to:t };
}

export function assertPositiveInt(value: unknown, field: string, max = 10000): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > max) throw new ValidationError(`${field} must be an integer between 1 and ${max}.`);
  return n;
}

export function assertIdentifier(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length < 1 || value.length > 255 || /[\u0000-\u001f]/.test(value)) throw new ValidationError(`${field} is invalid.`);
  return value;
}

export function assertAllowedEvent(event: string): void {
  const configured = (process.env.MIXPANEL_ALLOWED_EVENTS || "").split(",").map(x=>x.trim()).filter(Boolean);
  if (configured.length && !configured.includes(event)) throw new ValidationError(`Event '${event}' is not in MIXPANEL_ALLOWED_EVENTS.`);
}

export function redact(data: unknown): unknown {
  if (Array.isArray(data)) return data.map(redact);
  if (!data || typeof data !== "object") return data;
  const out: Record<string, unknown> = {};
  for (const [k,v] of Object.entries(data as Record<string, unknown>)) {
    if (/secret|password|authorization|service_account/i.test(k)) continue;
    out[k] = redact(v);
  }
  return out;
}
