export class ApprovalError extends Error {}
export function requireApproval(approved?: boolean) {
  if (process.env.AIRBRAKE_WRITE_ENABLED !== "true") throw new ApprovalError("Airbrake writes are disabled");
  if (approved !== true) throw new ApprovalError("Explicit human approval is required");
}
export function positiveId(v: number, label: string) {
  if (!Number.isSafeInteger(v) || v <= 0) throw new Error(`${label} must be a positive integer`);
  return v;
}
export function boundedPage(v = 1) { if (!Number.isInteger(v) || v < 1 || v > 100000) throw new Error("Invalid page"); return v; }
export function boundedLimit(v = 20) { if (!Number.isInteger(v) || v < 1 || v > 100) throw new Error("limit must be 1..100"); return v; }
