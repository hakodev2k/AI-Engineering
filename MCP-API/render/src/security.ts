export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export class ApprovalError extends Error {}

export function requireApproval(risk: Risk, confirmed: boolean): void {
  if (risk === 'READ') return;
  if (!confirmed) throw new ApprovalError('Explicit confirmation is required for this action.');
  if (risk === 'WRITE' && process.env.RENDER_ALLOW_WRITES !== 'true')
    throw new ApprovalError('WRITE actions are disabled. Set RENDER_ALLOW_WRITES=true after human review.');
  if (risk === 'HIGH_RISK' && process.env.RENDER_ALLOW_HIGH_RISK !== 'true')
    throw new ApprovalError('HIGH_RISK actions are disabled. Set RENDER_ALLOW_HIGH_RISK=true after human review.');
  if (risk === 'DESTRUCTIVE') throw new ApprovalError('DESTRUCTIVE actions are disabled by this connector.');
}

export function assertReadOnlySql(sql: string): void {
  const s = sql.trim();
  if (!s || s.includes(';')) throw new Error('SQL must contain exactly one statement without a semicolon.');
  if (!/^(select|with|explain|show)\b/i.test(s)) throw new Error('Only SELECT, WITH, EXPLAIN, or SHOW queries are allowed.');
  if (/\b(insert|update|delete|drop|alter|truncate|create|grant|revoke|copy|call|do)\b/i.test(s)) throw new Error('Mutating SQL is not allowed.');
}
