export type RiskLevel = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface ApprovalContext {
  approved?: boolean;
  approvalToken?: string;
}

export interface PolicyConfig {
  approvalMode: 'required' | 'optional';
  allowDestructive: boolean;
}

export class PolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PolicyError';
  }
}

export function assertAllowed(
  risk: RiskLevel,
  approval: ApprovalContext,
  config: PolicyConfig,
): void {
  if (risk === 'READ') return;

  if (risk === 'DESTRUCTIVE' && !config.allowDestructive) {
    throw new PolicyError('Destructive operations are disabled. Set BUNNYNET_ALLOW_DESTRUCTIVE=true only after an explicit operator decision.');
  }

  const approvalRequired = risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || config.approvalMode === 'required';
  if (approvalRequired && approval.approved !== true) {
    throw new PolicyError(`${risk} operation requires explicit human approval.`);
  }

  if (risk === 'DESTRUCTIVE' && (!approval.approvalToken || approval.approvalToken.length < 8)) {
    throw new PolicyError('Destructive operation requires a non-empty strong approval token (minimum 8 characters).');
  }
}
