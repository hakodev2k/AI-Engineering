import type { CanvaConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK';

export class ApprovalRequiredError extends Error {
  constructor(public readonly action: string) {
    super(`Human approval required for ${action}`);
    this.name = 'ApprovalRequiredError';
  }
}

export const actionKey = (tool: string, ...ids: string[]) => [tool, ...ids].join(':');

export function authorize(config: CanvaConfig, risk: Risk, action: string): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE' && !config.requireWriteApproval) return;
  if (!config.approvedActions.has(action)) throw new ApprovalRequiredError(action);
}
