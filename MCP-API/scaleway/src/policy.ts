import { config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface ApprovalContext {
  approved?: boolean;
}

export function enforceRisk(risk: Risk, ctx: ApprovalContext = {}): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE') {
    if (!config.allowWrite) throw new Error('WRITE operations are disabled by SCW_ALLOW_WRITE=false');
    if (!ctx.approved) throw new Error('Explicit human approval is required for WRITE operations');
    return;
  }
  if (risk === 'HIGH_RISK') {
    if (!config.allowHighRisk) throw new Error('HIGH_RISK operations are disabled by SCW_ALLOW_HIGH_RISK=false');
    if (!ctx.approved) throw new Error('Explicit human approval is required for HIGH_RISK operations');
    return;
  }
  throw new Error('DESTRUCTIVE operations are not implemented by this connector');
}
