import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'n8n.workflow.search': 'READ',
  'n8n.workflow.get': 'READ',
  'n8n.workflow.create': 'WRITE',
  'n8n.workflow.update': 'WRITE',
  'n8n.workflow.activate': 'HIGH_RISK',
  'n8n.workflow.deactivate': 'WRITE',
  'n8n.execution.list': 'READ',
  'n8n.execution.get': 'READ',
  'n8n.execution.delete': 'DESTRUCTIVE',
  'n8n.tag.list': 'READ',
  'n8n.tag.create': 'WRITE',
  'n8n.project.list': 'READ'
};

export function expectedApproval(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (TOOL_RISK[tool] === 'READ') return;
  if (!secret) throw new Error(`Approval secret is not configured for ${tool}`);
  if (!approvalId) throw new Error(`Explicit approval is required for ${tool}`);
  const expected = expectedApproval(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
