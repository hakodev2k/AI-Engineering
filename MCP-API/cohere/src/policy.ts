import crypto from 'node:crypto';
import { CohereConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertWriteApproval(config: CohereConfig, tool: string, approvalId?: string) {
  if (!config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error('Write approval is required but COHERE_APPROVAL_SECRET is not configured');
  if (!approvalId) throw new Error(`Explicit approval required for ${tool}`);
  const expected = approvalDigest(config.approvalSecret, tool);
  const actual = Buffer.from(approvalId);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !crypto.timingSafeEqual(actual, wanted)) throw new Error(`Invalid approval for ${tool}`);
}
