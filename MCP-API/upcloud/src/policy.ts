import { config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function requirePermission(risk: Risk, approved: boolean) {
  if (risk === 'READ') return;
  if (risk === 'WRITE' && !config.allowWrite) throw new Error('WRITE operations are disabled');
  if (risk === 'HIGH_RISK') {
    if (!config.allowHighRisk) throw new Error('HIGH_RISK operations are disabled');
    if (!approved) throw new Error('Explicit human approval is required');
  }
  if (risk === 'DESTRUCTIVE') {
    if (!config.allowDestructive) throw new Error('DESTRUCTIVE operations are disabled');
    if (!approved) throw new Error('Strong explicit human approval is required');
  }
}
