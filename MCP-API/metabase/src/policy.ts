export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface PolicyContext {
  approved?: boolean;
  allowWrite?: boolean;
}

export function enforce(risk: Risk, ctx: PolicyContext, requireWriteApproval: boolean): void {
  if (risk === 'READ') return;
  if (!ctx.allowWrite) throw new Error('permission_denied: write operations are disabled');
  if ((requireWriteApproval || risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE') && !ctx.approved) {
    throw new Error('approval_required: explicit human approval is required');
  }
  if (risk === 'DESTRUCTIVE') throw new Error('permission_denied: destructive operations are disabled by this connector');
}
