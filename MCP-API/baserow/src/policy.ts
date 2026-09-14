import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'DESTRUCTIVE';

export function approvalDigest(secret: string, tool: string, resource: string): string {
  return createHmac('sha256', secret).update(`${tool}\n${resource}`).digest('hex');
}

export function assertWriteApproval(config: Config, tool: string, resource: string, approvalId?: string): void {
  if (!config.requireWriteApproval) return;
  assertApproval(config, tool, resource, approvalId);
}

export function assertApproval(config: Config, tool: string, resource: string, approvalId?: string): void {
  if (!config.approvalSecret) throw new Error('Approval is required but BASEROW_APPROVAL_SECRET is not configured');
  if (!approvalId || !/^[a-f0-9]{64}$/i.test(approvalId)) throw new Error(`Explicit approval required for ${tool}`);
  const expected = approvalDigest(config.approvalSecret, tool, resource);
  const a = Buffer.from(approvalId.toLowerCase(), 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}

export function assertDeleteEnabled(config: Config): void {
  if (!config.enableDelete) throw new Error('Delete tools are disabled. Set BASEROW_ENABLE_DELETE=true only after policy review.');
}
