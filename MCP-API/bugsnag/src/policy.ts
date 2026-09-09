export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface PolicyOptions {
  requireWriteApproval: boolean;
}

export class ApprovalRequiredError extends Error {
  constructor(public readonly risk: Risk) {
    super(`Human approval is required for ${risk} operation`);
    this.name = 'ApprovalRequiredError';
  }
}

export function authorize(risk: Risk, approved: boolean | undefined, options: PolicyOptions): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE' && !options.requireWriteApproval) return;
  if (approved !== true) throw new ApprovalRequiredError(risk);
  if (risk === 'DESTRUCTIVE') throw new Error('Destructive BugSnag operations are not exposed by this connector');
}
