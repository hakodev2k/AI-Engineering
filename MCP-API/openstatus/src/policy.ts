export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function authorize(risk: Risk, approved: boolean | undefined, requireWriteApproval: boolean): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE') throw new Error('DESTRUCTIVE operations are not exposed by this connector');
  if (risk === 'HIGH_RISK' && approved !== true) {
    throw new Error('Explicit human approval is required for this HIGH_RISK operation');
  }
  if (risk === 'WRITE' && requireWriteApproval && approved !== true) {
    throw new Error('Human approval is required for WRITE operations by configuration');
  }
}

export function isRetryableReadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /(429|5\d\d|ECONNRESET|ETIMEDOUT|fetch failed|network|temporar)/i.test(message);
}
