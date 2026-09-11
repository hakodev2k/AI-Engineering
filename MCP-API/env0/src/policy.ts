import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function requireApproval(config: Config, risk: Risk, approved: boolean | undefined): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !config.enableDestructive) throw new Error('Destructive env0 operations are disabled by policy');
  if ((risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || (risk === 'WRITE' && config.requireWriteApproval)) && approved !== true) {
    throw new Error(`Explicit human approval is required for ${risk} operation`);
  }
}
