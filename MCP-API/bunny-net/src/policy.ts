import { config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function enforceRisk(risk: Risk, approval?: boolean): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE') {
    if (!config.allowWrite) throw new Error('WRITE tools are disabled. Set BUNNY_ALLOW_WRITE=true.');
    if (!approval) throw new Error('Explicit approval is required for WRITE tools.');
    return;
  }
  if (risk === 'HIGH_RISK') {
    if (!config.allowHighRisk) throw new Error('HIGH_RISK tools are disabled. Set BUNNY_ALLOW_HIGH_RISK=true.');
    if (!approval) throw new Error('Explicit human approval is required for HIGH_RISK tools.');
    return;
  }
  if (!config.allowDestructive) throw new Error('DESTRUCTIVE tools are disabled. Set BUNNY_ALLOW_DESTRUCTIVE=true.');
  if (!approval) throw new Error('Explicit strong human approval is required for DESTRUCTIVE tools.');
}
