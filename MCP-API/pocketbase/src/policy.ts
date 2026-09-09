export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export type PolicyConfig = {
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

export function authorize(risk: Risk, approved: boolean | undefined, cfg: PolicyConfig): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !cfg.destructiveEnabled) throw new Error('DESTRUCTIVE_DISABLED');
  if (cfg.requireWriteApproval && approved !== true) throw new Error('APPROVAL_REQUIRED');
}
