export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface ApprovalContext { approved?: boolean; }

export class PolicyError extends Error {
  constructor(public code: string, message: string) { super(message); }
}

export class Policy {
  constructor(private cfg: { allowWrite: boolean; allowHighRisk: boolean; allowDestructive: boolean }) {}

  assert(risk: Risk, approval: ApprovalContext = {}) {
    if (risk === 'READ') return;
    if (risk === 'WRITE') {
      if (!this.cfg.allowWrite) throw new PolicyError('WRITE_DISABLED', 'Write tools are disabled by configuration');
      if (!approval.approved) throw new PolicyError('APPROVAL_REQUIRED', 'Explicit human approval is required');
      return;
    }
    if (risk === 'HIGH_RISK') {
      if (!this.cfg.allowHighRisk) throw new PolicyError('HIGH_RISK_DISABLED', 'High-risk tools are disabled by configuration');
      if (!approval.approved) throw new PolicyError('APPROVAL_REQUIRED', 'Explicit human approval is required');
      return;
    }
    if (!this.cfg.allowDestructive) throw new PolicyError('DESTRUCTIVE_DISABLED', 'Destructive tools are disabled by default');
    if (!approval.approved) throw new PolicyError('STRONG_APPROVAL_REQUIRED', 'Strong explicit human approval is required');
  }
}
