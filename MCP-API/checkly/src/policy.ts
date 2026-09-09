export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function authorize(risk: Risk, approved: boolean | undefined, requireWriteApproval: boolean): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE') throw new Error('Destructive Checkly operations are not exposed by this connector');
  if (risk === 'HIGH_RISK' && approved !== true) throw new Error('Explicit human approval is required');
  if (risk === 'WRITE' && requireWriteApproval && approved !== true) throw new Error('Human approval is required for write operations');
}

export function safeSegment(value: string, field: string): string {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(value)) throw new Error(`${field} contains invalid characters`);
  return encodeURIComponent(value);
}
