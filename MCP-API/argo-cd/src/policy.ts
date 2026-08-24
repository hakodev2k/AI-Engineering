import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'argocd.application.list': 'READ',
  'argocd.application.get': 'READ',
  'argocd.application.resource_tree': 'READ',
  'argocd.application.manifests': 'READ',
  'argocd.application.events': 'READ',
  'argocd.application.sync_windows': 'READ',
  'argocd.application.revision_metadata': 'READ',
  'argocd.project.list': 'READ',
  'argocd.project.get': 'READ',
  'argocd.repository.list': 'READ',
  'argocd.cluster.list': 'READ',
  'argocd.application.sync': 'HIGH_RISK'
};

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error(`${tool} requires ARGOCD_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
