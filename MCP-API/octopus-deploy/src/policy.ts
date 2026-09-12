import type { OctopusConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export class ApprovalError extends Error {
  constructor(public readonly risk: Risk) {
    super(`Approval required for ${risk} operation`);
    this.name = 'ApprovalError';
  }
}

export function requireApproval(config: OctopusConfig, risk: Risk): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE' && config.writeApproved) return;
  if (risk === 'HIGH_RISK' && config.highRiskApproved) return;
  throw new ApprovalError(risk);
}
