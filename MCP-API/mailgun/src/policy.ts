import { config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function assertPermission(risk: Risk, approved: boolean): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE' && !config.allowWrite) throw new Error('WRITE operations are disabled by policy.');
  if (risk === 'HIGH_RISK') {
    if (!config.allowHighRisk) throw new Error('HIGH_RISK operations are disabled by policy.');
    if (!approved) throw new Error('Explicit human approval is required.');
  }
  if (risk === 'DESTRUCTIVE') {
    if (!config.allowDestructive) throw new Error('DESTRUCTIVE operations are disabled by policy.');
    if (!approved) throw new Error('Explicit strong human approval is required.');
  }
}
