import type { GongConfig } from './config.js';

export type Risk = 'READ' | 'HIGH_RISK';

export function requireApproval(config: GongConfig, risk: Risk): void {
  if (risk === 'HIGH_RISK' && !config.highRiskApproved) {
    throw new Error('Explicit human approval is required. Set GONG_HIGH_RISK_APPROVED=true only for the approved execution window.');
  }
}
