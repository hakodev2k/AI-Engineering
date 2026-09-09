export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK';

export type PolicyConfig = {
  requireWriteApproval: boolean;
  enableHighRisk: boolean;
};

export function authorize(risk: Risk, approved: boolean | undefined, config: PolicyConfig): void {
  if (risk === 'READ') return;
  if (risk === 'HIGH_RISK' && !config.enableHighRisk) throw new Error('HIGH_RISK_DISABLED');
  if (config.requireWriteApproval && approved !== true) throw new Error('APPROVAL_REQUIRED');
}
