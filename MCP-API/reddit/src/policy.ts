import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'reddit.identity.get': 'READ',
  'reddit.subreddit.search': 'READ',
  'reddit.subreddit.get': 'READ',
  'reddit.post.list': 'READ',
  'reddit.post.search': 'READ',
  'reddit.post.get': 'READ',
  'reddit.comments.list': 'READ',
  'reddit.comment.create': 'WRITE',
  'reddit.post.create': 'WRITE',
  'reddit.thing.save': 'WRITE',
  'reddit.thing.unsave': 'WRITE'
};

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (TOOL_RISK[tool] === 'READ') return;
  if (!secret) throw new Error(`Approval secret is not configured for ${tool}`);
  if (!approvalId) throw new Error(`Explicit approval required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
