import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'github.user.get': 'READ',
  'github.repository.search': 'READ',
  'github.file.read': 'READ',
  'github.code.search': 'READ',
  'github.issue.search': 'READ',
  'github.issue.get': 'READ',
  'github.pull_request.get': 'READ',
  'github.branch.create': 'WRITE',
  'github.issue.create': 'WRITE',
  'github.issue.comment': 'WRITE',
  'github.pull_request.create': 'WRITE',
  'github.pull_request.merge': 'HIGH_RISK'
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
