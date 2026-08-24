import crypto from 'node:crypto';
import type { RedisConnectorConfig } from './config.js';

function digest(secret: string, tool: string): string {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertWriteApproval(config: RedisConnectorConfig, tool: string, approvalId?: string): void {
  if (!config.approvalSecret) throw new Error(`${tool} is disabled because REDIS_APPROVAL_SECRET is not configured`);
  const expected = digest(config.approvalSecret, tool);
  if (!approvalId || approvalId.length !== 64 || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(approvalId))) {
    throw new Error(`${tool} requires explicit approval`);
  }
}

export function assertDestructiveApproval(config: RedisConnectorConfig, tool: string, approvalId?: string): void {
  if (!config.allowDestructive) throw new Error(`${tool} is disabled by default; set REDIS_ALLOW_DESTRUCTIVE=true to opt in`);
  if (!config.destructiveApprovalSecret) throw new Error(`${tool} requires REDIS_DESTRUCTIVE_APPROVAL_SECRET`);
  const expected = digest(config.destructiveApprovalSecret, tool);
  if (!approvalId || approvalId.length !== 64 || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(approvalId))) {
    throw new Error(`${tool} requires strong explicit approval`);
  }
}

export function makeApprovalId(secret: string, tool: string): string {
  return digest(secret, tool);
}
