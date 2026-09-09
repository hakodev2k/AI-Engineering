import type { PrefectConfig } from './config.js';
import { verifyApproval } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function authorize(config: PrefectConfig, tool: string, risk: Risk, payload: Record<string, unknown>, approvalToken?: string): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE') throw new Error('Destructive operations are not exposed by this connector');
  if (risk === 'HIGH_RISK' && !config.enableHighRisk) throw new Error('HIGH_RISK operations are disabled; set PREFECT_ENABLE_HIGH_RISK=true outside model context');
  if (risk === 'WRITE' && !config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error('PREFECT_APPROVAL_SECRET is required for approval-gated operations');
  if (!verifyApproval(config.approvalSecret, tool, payload, approvalToken)) throw new Error('Explicit human approval is required for this exact operation');
}
