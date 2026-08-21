export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export class ApprovalRequiredError extends Error {
  constructor(public readonly toolName: string, public readonly risk: Risk) {
    super(`Explicit human approval is required for ${toolName} (${risk}). Re-run with approved=true after review.`);
  }
}

export function requireApproval(toolName: string, risk: Risk, approved: boolean | undefined, requireWriteApproval: boolean): void {
  if (risk === 'READ') return;
  const mandatory = risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || requireWriteApproval;
  if (mandatory && approved !== true) throw new ApprovalRequiredError(toolName, risk);
}

export function assertSafeProjectId(value: string): string {
  const v = value.trim();
  if (!v || v.length > 512 || /[\r\n\0]/.test(v)) throw new Error('Invalid project identifier.');
  return encodeURIComponent(v);
}

export function assertSafeRef(value: string): string {
  const v = value.trim();
  if (!v || v.length > 255 || /[\r\n\0]/.test(v)) throw new Error('Invalid Git ref.');
  return v;
}

export function assertSafeBody(value: string, max = 1_000_000): string {
  if (value.length === 0 || value.length > max || value.includes('\0')) throw new Error('Invalid body.');
  return value;
}
