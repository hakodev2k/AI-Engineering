export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error {}
export function authorize(risk: Risk, approved=false) {
  const write = process.env.LAUNCHDARKLY_ALLOW_WRITE === 'true';
  const destructive = process.env.LAUNCHDARKLY_ALLOW_DESTRUCTIVE === 'true';
  if (risk === 'READ') return;
  if (!write) throw new ApprovalError('Write operations are disabled. Set LAUNCHDARKLY_ALLOW_WRITE=true after granting least-privilege token permissions.');
  if ((risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE') && !approved) throw new ApprovalError('Explicit human approval is required.');
  if (risk === 'DESTRUCTIVE' && !destructive) throw new ApprovalError('Destructive operations are disabled. Set LAUNCHDARKLY_ALLOW_DESTRUCTIVE=true and provide approval=true.');
}
