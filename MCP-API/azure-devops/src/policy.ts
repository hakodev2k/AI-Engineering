import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'azure_devops.project.list': 'READ',
  'azure_devops.repository.list': 'READ',
  'azure_devops.file.read': 'READ',
  'azure_devops.pull_request.list': 'READ',
  'azure_devops.pull_request.get': 'READ',
  'azure_devops.pull_request.create': 'WRITE',
  'azure_devops.work_item.get': 'READ',
  'azure_devops.work_item.create': 'WRITE',
  'azure_devops.work_item.comment': 'WRITE',
  'azure_devops.build.list': 'READ',
  'azure_devops.build.get': 'READ',
  'azure_devops.pipeline.run': 'HIGH_RISK'
};

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (TOOL_RISK[tool] === 'READ') return;
  if (!secret) throw new Error(`Approval secret is not configured for ${tool}`);
  if (!approvalId) throw new Error(`Explicit human approval is required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
