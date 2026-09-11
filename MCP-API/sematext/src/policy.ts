export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function requireApproval(risk: Risk, approved: boolean | undefined, requireWriteApproval: boolean): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE') throw new Error('DESTRUCTIVE operations are not implemented by this connector.');
  if (risk === 'HIGH_RISK' && approved !== true) throw new Error('Explicit human approval is required for this HIGH_RISK operation.');
  if (risk === 'WRITE' && requireWriteApproval && approved !== true) throw new Error('Human approval is required for this WRITE operation.');
}
