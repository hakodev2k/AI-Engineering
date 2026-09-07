export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export type ApprovalContext = { approved?: boolean };

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'canny.board.list': { risk: 'READ', approval: false },
  'canny.board.get': { risk: 'READ', approval: false },
  'canny.category.list': { risk: 'READ', approval: false },
  'canny.post.list': { risk: 'READ', approval: false },
  'canny.post.get': { risk: 'READ', approval: false },
  'canny.comment.list': { risk: 'READ', approval: false },
  'canny.user.get': { risk: 'READ', approval: false },
  'canny.post.create': { risk: 'WRITE', approval: true },
  'canny.post.update': { risk: 'WRITE', approval: true },
  'canny.post.change_status': { risk: 'HIGH_RISK', approval: true },
  'canny.comment.create': { risk: 'WRITE', approval: true },
  'canny.vote.create': { risk: 'WRITE', approval: true }
};

export function enforcePolicy(tool: string, ctx: ApprovalContext, requireWriteApproval = true): void {
  const p = TOOL_POLICY[tool];
  if (!p) throw new Error(`Unknown tool policy: ${tool}`);
  if ((p.risk === 'HIGH_RISK' || p.risk === 'DESTRUCTIVE') && ctx.approved !== true) throw new Error('Explicit human approval required');
  if (p.risk === 'WRITE' && requireWriteApproval && ctx.approved !== true) throw new Error('Write approval required');
}
