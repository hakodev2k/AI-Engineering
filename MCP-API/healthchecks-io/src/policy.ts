import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'DESTRUCTIVE';
export type Approval = { approved?: boolean; approvalToken?: string };

export function requireApproval(config: Config, risk: Risk, approval: Approval = {}) {
  const required = risk === 'DESTRUCTIVE' || config.HEALTHCHECKS_APPROVAL_MODE === 'all' || (risk === 'WRITE' && config.HEALTHCHECKS_APPROVAL_MODE === 'write');
  if (required && approval.approved !== true) {
    throw new Error(`approval_required:${risk}`);
  }
}
