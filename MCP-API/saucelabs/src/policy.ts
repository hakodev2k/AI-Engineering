import type { SauceConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export class ApprovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApprovalError';
  }
}

export function requireApproval(config: SauceConfig, risk: Risk, approved: boolean): void {
  if (risk === 'READ') return;
  if (!config.enableWrites) throw new ApprovalError('Writes are disabled. Set SAUCE_ENABLE_WRITES=true outside the LLM/tool input path.');
  if (approved !== true) throw new ApprovalError(`${risk} operation requires explicit human approval (approved=true).`);
  if (risk === 'DESTRUCTIVE') throw new ApprovalError('Destructive operations are disabled by this connector.');
}
