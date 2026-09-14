import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function approvalToken(action: string, secret: string): string {
  return createHmac('sha256', secret).update(action).digest('hex');
}

export function assertAllowed(action: string, risk: Risk, approvalId: string | undefined, config: Config): void {
  if (risk === 'READ') return;
  if (!config.allowWrites) throw new Error(`${action} is disabled: set KEYGEN_ALLOW_WRITES=true`);
  if (risk === 'DESTRUCTIVE' && !config.allowDestructive) throw new Error(`${action} is disabled: set KEYGEN_ALLOW_DESTRUCTIVE=true`);
  if (!config.approvalSecret) throw new Error(`${action} requires KEYGEN_APPROVAL_SECRET`);
  if (!approvalId || !/^[a-f0-9]{64}$/.test(approvalId)) throw new Error(`${action} requires explicit human approval`);
  const expected = approvalToken(action, config.approvalSecret);
  const a = Buffer.from(approvalId, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error(`${action} approval is invalid`);
}
