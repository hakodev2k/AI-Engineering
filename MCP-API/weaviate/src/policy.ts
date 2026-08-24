import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error(`Approval secret is not configured for ${tool}`);
  if (!approvalId) throw new Error(`Explicit approval required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval token for ${tool}`);
}
