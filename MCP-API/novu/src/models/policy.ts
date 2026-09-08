export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export type Policy = { requireWriteApproval: boolean; destructiveEnabled: boolean };

export function authorize(risk: Risk, approved: boolean | undefined, policy: Policy): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !policy.destructiveEnabled) throw new Error('DESTRUCTIVE_DISABLED');
  if (policy.requireWriteApproval && approved !== true) throw new Error('APPROVAL_REQUIRED');
}
