import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'replicate.model.search': 'READ',
  'replicate.model.get': 'READ',
  'replicate.model.version.list': 'READ',
  'replicate.prediction.list': 'READ',
  'replicate.prediction.get': 'READ',
  'replicate.prediction.create': 'WRITE',
  'replicate.prediction.cancel': 'WRITE',
  'replicate.deployment.list': 'READ',
  'replicate.deployment.get': 'READ',
  'replicate.deployment.prediction.create': 'WRITE',
  'replicate.training.list': 'READ',
  'replicate.training.get': 'READ',
  'replicate.training.cancel': 'WRITE'
};

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  const risk = TOOL_RISK[tool];
  if (risk === 'READ') return;
  if (!secret) throw new Error(`${tool} requires approval but REPLICATE_APPROVAL_SECRET is not configured`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool);
  const actual = Buffer.from(approvalId);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !crypto.timingSafeEqual(actual, wanted)) throw new Error(`Invalid approval for ${tool}`);
}
