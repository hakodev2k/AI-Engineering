import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK';

export const TOOL_RISK: Record<string, Risk> = {
  'openrouter.model.list': 'READ',
  'openrouter.benchmark.list': 'READ',
  'openrouter.generation.get': 'READ',
  'openrouter.generation.content.get': 'HIGH_RISK',
  'openrouter.activity.list': 'READ',
  'openrouter.credits.get': 'READ',
  'openrouter.analytics.meta': 'READ',
  'openrouter.analytics.query': 'READ',
  'openrouter.inference.chat': 'WRITE',
  'openrouter.embedding.create': 'WRITE'
};

export function assertApproval(tool: string, provided: string | undefined, secret: string | undefined) {
  const risk = TOOL_RISK[tool];
  if (risk === 'READ') return;
  if (!secret) throw new Error(`Approval secret is required for ${tool}`);
  if (!provided) throw new Error(`Explicit approval is required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
