import crypto from 'node:crypto';

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error(`Approval secret is not configured; refusing ${tool}`);
  if (!approvalId || !/^[a-f0-9]{64}$/i.test(approvalId)) throw new Error(`Explicit approval is required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId.toLowerCase(), 'utf8');
  const b = Buffer.from(expected.toLowerCase(), 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
