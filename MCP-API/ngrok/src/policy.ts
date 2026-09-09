export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export type PolicyConfig = {
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

export function authorize(risk: Risk, approved: boolean | undefined, cfg: PolicyConfig): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE') {
    if (cfg.requireWriteApproval && approved !== true) {
      throw new Error('Human approval is required for WRITE operations');
    }
    return;
  }
  if (risk === 'HIGH_RISK') {
    if (approved !== true) throw new Error('Explicit human approval is required for HIGH_RISK operations');
    return;
  }
  if (!cfg.destructiveEnabled) throw new Error('DESTRUCTIVE operations are disabled by configuration');
  if (approved !== true) throw new Error('Explicit human approval is required for DESTRUCTIVE operations');
}
