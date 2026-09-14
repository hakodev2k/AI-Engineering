import { createHmac, timingSafeEqual } from 'node:crypto';
import type { HookdeckConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== 'approvalId')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalToken(secret: string, action: string, args: unknown): string {
  return createHmac('sha256', secret).update(`${action}\n${canonical(args)}`).digest('hex');
}

export function assertWriteApproved(config: HookdeckConfig, action: string, args: Record<string, unknown>, supplied?: string): void {
  if (!config.enableWrites) throw new Error(`${action} is WRITE and is disabled; set HOOKDECK_ENABLE_WRITES=true only after assigning an approval owner`);
  if (!config.approvalSecret) throw new Error('HOOKDECK_APPROVAL_SECRET is required for write actions');
  if (!supplied || !/^[a-f0-9]{64}$/i.test(supplied)) throw new Error(`Explicit human approval is required for ${action}`);
  const expected = approvalToken(config.approvalSecret, action, args);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(supplied, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error(`Approval token is invalid for ${action} and this exact payload`);
}
