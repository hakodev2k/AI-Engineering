import { createHmac, timingSafeEqual } from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'jira.resources.list': 'READ',
  'jira.project.list': 'READ',
  'jira.issue.search': 'READ',
  'jira.issue.get': 'READ',
  'jira.issue.transitions.list': 'READ',
  'jira.issue.create_metadata.get': 'READ',
  'jira.user.lookup': 'READ',
  'jira.comment.add': 'WRITE',
  'jira.worklog.add': 'WRITE',
  'jira.issue.create': 'WRITE',
  'jira.issue.update': 'WRITE',
  'jira.issue.transition': 'HIGH_RISK'
};

export function approvalFor(tool: string, approvalSecret: string): string {
  if (!approvalSecret) throw new Error('JIRA_APPROVAL_SECRET is required for write operations');
  return createHmac('sha256', approvalSecret).update(tool).digest('hex');
}

export function assertApproval(tool: string, supplied: string | undefined, approvalSecret: string): void {
  if (TOOL_RISK[tool] === 'READ') return;
  const expected = approvalFor(tool, approvalSecret);
  if (!supplied) throw new Error(`Explicit approval is required for ${tool}`);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
