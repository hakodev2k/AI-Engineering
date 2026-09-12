import type { Config } from './config.js';

export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';

export function requireApproval(config: Config, risk: Risk): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE' && config.writeApproved) return;
  throw new Error(`Human approval required for ${risk} operation`);
}
