import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'linear.issue.list': 'READ',
  'linear.issue.get': 'READ',
  'linear.project.list': 'READ',
  'linear.project.get': 'READ',
  'linear.comment.list': 'READ',
  'linear.user.list': 'READ',
  'linear.label.list': 'READ',
  'linear.issue.save': 'WRITE',
  'linear.project.save': 'WRITE',
  'linear.document.save': 'WRITE'
};

export function expectedApproval(tool: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string): void {
  const risk = TOOL_RISK[tool];
  if (!risk || risk === 'READ') return;
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = expectedApproval(tool, secret);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
