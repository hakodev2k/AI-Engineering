import { timingSafeEqual } from 'node:crypto';

export type RiskLevel = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export class ApprovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApprovalError';
  }
}

export function requireApproval(configuredToken: string | undefined, suppliedToken: string | undefined): void {
  if (!configuredToken) {
    throw new ApprovalError('Write tools are disabled because SOLARWINDS_IR_APPROVAL_TOKEN is not configured');
  }
  if (!suppliedToken) throw new ApprovalError('Explicit human approval is required for this write operation');
  const expected = Buffer.from(configuredToken);
  const actual = Buffer.from(suppliedToken);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new ApprovalError('Approval token is invalid');
  }
}
