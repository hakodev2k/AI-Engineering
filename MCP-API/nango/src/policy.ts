export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function authorize(risk: Risk, approved: boolean | undefined, requireWriteApproval: boolean): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE') throw new Error('DESTRUCTIVE_NOT_EXPOSED');
  if ((risk === 'HIGH_RISK' || (risk === 'WRITE' && requireWriteApproval)) && approved !== true) {
    throw new Error('APPROVAL_REQUIRED');
  }
}
