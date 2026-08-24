import crypto from 'node:crypto';
import type { SpotifyConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, config: SpotifyConfig, risk: Risk) {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !config.enableDestructive) throw new Error(`${tool} is disabled; set SPOTIFY_ENABLE_DESTRUCTIVE=true to enable`);
  if (!config.approvalSecret) throw new Error(`${tool} requires SPOTIFY_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approvalId`);
  const expected = approvalDigest(config.approvalSecret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approvalId for ${tool}`);
}
