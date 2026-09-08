import type { GristConfig } from './auth.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export type Approval = { approved?: boolean };

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export function authorize(config: GristConfig, risk: Risk, approval?: Approval): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE') {
    if (!config.allowWrite) throw new PermissionError('WRITE tools are disabled by GRIST_ALLOW_WRITE');
    if (!approval?.approved) throw new PermissionError('Explicit human approval is required for this WRITE tool');
    return;
  }
  if (risk === 'HIGH_RISK') {
    if (!config.allowHighRisk) throw new PermissionError('HIGH_RISK tools are disabled by GRIST_ALLOW_HIGH_RISK');
    if (!approval?.approved) throw new PermissionError('Explicit human approval is required for this HIGH_RISK tool');
    return;
  }
  if (!config.allowDestructive) throw new PermissionError('DESTRUCTIVE tools are disabled by GRIST_ALLOW_DESTRUCTIVE');
  if (!approval?.approved) throw new PermissionError('Explicit strong human approval is required for this DESTRUCTIVE tool');
}
