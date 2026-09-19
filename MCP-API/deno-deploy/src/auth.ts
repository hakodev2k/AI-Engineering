export function requireToken(env: NodeJS.ProcessEnv = process.env): string {
  const token = env.DENO_DEPLOY_TOKEN?.trim();
  if (!token) throw new Error('AUTH_CONFIG: DENO_DEPLOY_TOKEN is required');
  return token;
}

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export interface ApprovalContext { approved?: boolean }

export function authorize(risk: Risk, ctx: ApprovalContext = {}, env: NodeJS.ProcessEnv = process.env): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && env.DENO_DEPLOY_DESTRUCTIVE_ENABLED !== 'true') throw new Error('PERMISSION_DENIED: destructive tools are disabled');
  const writesRequireApproval = env.DENO_DEPLOY_WRITE_APPROVAL !== 'optional';
  if ((risk === 'WRITE' && writesRequireApproval || risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE') && ctx.approved !== true) {
    throw new Error(`APPROVAL_REQUIRED: ${risk} operation requires explicit human approval`);
  }
}
