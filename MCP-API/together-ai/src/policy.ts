import crypto from 'node:crypto';
import type { TogetherConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK';

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error(`${tool} requires TOGETHER_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}

export function assertCostingWriteEnabled(config: TogetherConfig, tool: string) {
  if (!config.enableCostingWrites) throw new Error(`${tool} is disabled until TOGETHER_ENABLE_COSTING_WRITES=true`);
}

export function assertFineTuningEnabled(config: TogetherConfig, tool: string) {
  if (!config.enableFineTuning) throw new Error(`${tool} is disabled until TOGETHER_ENABLE_FINE_TUNING=true`);
}
