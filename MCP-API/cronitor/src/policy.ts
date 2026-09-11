import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export class ApprovalError extends Error {}
export class DestructiveDisabledError extends Error {}

export function assertAllowed(config: Config, risk: Risk, approved?: boolean): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !config.enableDestructive) {
    throw new DestructiveDisabledError('Destructive Cronitor tools are disabled. Set CRONITOR_ENABLE_DESTRUCTIVE=true only after policy review.');
  }
  if ((risk === 'WRITE' && config.requireWriteApproval) || risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE') {
    if (approved !== true) throw new ApprovalError(`${risk} operation requires explicit approved=true.`);
  }
}

export function encodePath(value: string): string {
  if (!/^[A-Za-z0-9_.:-]{1,200}$/.test(value)) throw new Error('Invalid resource key.');
  return encodeURIComponent(value);
}
