import type { Config } from './config.js';
export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function requireApproval(cfg: Config, risk: Risk, approved?: boolean): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE') throw new Error('Destructive Port tools are disabled by this connector.');
  if (!cfg.writeApproved || approved !== true) throw new Error('Explicit human approval is required for this Port write operation.');
}
