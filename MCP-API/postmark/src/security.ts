export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export class ApprovalError extends Error {}

export function requireApproval(risk: Risk, approved: boolean | undefined, requireWrite = true): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE' && !requireWrite) return;
  if (approved !== true) throw new ApprovalError(`${risk} operation requires explicit approval`);
}

export function safeBaseUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Postmark API base URL must be HTTPS without embedded credentials');
  return url;
}
