import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export function assertApproval(tool: string, supplied: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error(`Approval secret is not configured for ${tool}`);
  if (!supplied) throw new Error(`Explicit approval is required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
