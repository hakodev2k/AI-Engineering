import crypto from 'node:crypto';

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error(`Approval secret is not configured for ${tool}`);
  if (!approvalId || approvalId.length !== 64) throw new Error(`Explicit approval is required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const left = Buffer.from(approvalId, 'hex');
  const right = Buffer.from(expected, 'hex');
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) throw new Error(`Invalid approval for ${tool}`);
}
