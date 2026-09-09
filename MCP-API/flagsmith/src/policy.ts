export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface PolicyConfig {
  requireWriteApproval: boolean;
}

export function authorize(risk: Risk, approved: boolean | undefined, cfg: PolicyConfig): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE' && !cfg.requireWriteApproval) return;
  if (approved !== true) {
    throw new Error(`${risk} operation requires explicit human approval (approved=true)`);
  }
  if (risk === 'DESTRUCTIVE') {
    throw new Error('DESTRUCTIVE operations are not exposed by this connector');
  }
}
