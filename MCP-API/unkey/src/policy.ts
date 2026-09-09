export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export type PolicyConfig = {
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

export function authorize(risk: Risk, approved: boolean | undefined, cfg: PolicyConfig): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !cfg.destructiveEnabled) throw new Error('DESTRUCTIVE tools are disabled by configuration');
  const needsApproval = risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || (risk === 'WRITE' && cfg.requireWriteApproval);
  if (needsApproval && approved !== true) throw new Error(`Human approval required for ${risk} operation`);
}
