export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface PolicyConfig {
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
}

export function authorize(risk: Risk, approved: boolean | undefined, config: PolicyConfig): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !config.destructiveEnabled) throw new Error('DESTRUCTIVE_DISABLED');
  if (config.requireWriteApproval && approved !== true) throw new Error('APPROVAL_REQUIRED');
}
