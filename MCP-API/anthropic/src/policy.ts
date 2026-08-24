import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const toolRisk: Record<string, Risk> = {
  'anthropic.model.list': 'READ',
  'anthropic.model.get': 'READ',
  'anthropic.message.count_tokens': 'READ',
  'anthropic.message.create': 'WRITE',
  'anthropic.batch.list': 'READ',
  'anthropic.batch.get': 'READ',
  'anthropic.batch.results': 'READ',
  'anthropic.batch.create': 'WRITE',
  'anthropic.batch.cancel': 'HIGH_RISK'
};

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (toolRisk[tool] === 'READ') return;
  if (!secret) throw new Error(`Approval is required for ${tool}, but ANTHROPIC_APPROVAL_SECRET is not configured`);
  if (!approvalId) throw new Error(`Explicit approval required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
