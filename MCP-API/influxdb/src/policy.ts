import { createHash, timingSafeEqual } from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'DESTRUCTIVE';

export function approvalDigest(tool: string, secret: string): string {
  return createHash('sha256').update(`${tool}:${secret}`).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined): void {
  if (!secret) throw new Error(`Approval secret is not configured for ${tool}`);
  if (!approvalId) throw new Error(`Explicit approval is required for ${tool}`);
  const expected = Buffer.from(approvalDigest(tool, secret), 'utf8');
  const actual = Buffer.from(approvalId, 'utf8');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new Error(`Invalid approval for ${tool}`);
}
