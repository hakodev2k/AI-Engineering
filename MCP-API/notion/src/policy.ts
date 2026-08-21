import { timingSafeEqual } from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'notion.workspace.get': 'READ',
  'notion.search': 'READ',
  'notion.content.fetch': 'READ',
  'notion.comments.get': 'READ',
  'notion.users.get': 'READ',
  'notion.teams.get': 'READ',
  'notion.page.create': 'WRITE',
  'notion.page.update': 'WRITE',
  'notion.comment.create': 'WRITE',
  'notion.page.move': 'HIGH_RISK',
  'notion.page.duplicate': 'WRITE',
  'notion.database.create': 'WRITE'
};

export function assertApproval(tool: string, approvalId: string | undefined, secret?: string): void {
  const risk = TOOL_RISK[tool];
  if (!risk || risk === 'READ') return;
  if (!secret) throw new Error(`Approval is required for ${tool}, but NOTION_APPROVAL_SECRET is not configured`);
  if (!approvalId) throw new Error(`Explicit approvalId is required for ${tool}`);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error(`Invalid approvalId for ${tool}`);
}
