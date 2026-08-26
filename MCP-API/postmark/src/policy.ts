import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approvalRequired: boolean }> = {
  'postmark.server.get': { risk: 'READ', approvalRequired: false },
  'postmark.email.search': { risk: 'READ', approvalRequired: false },
  'postmark.email.get': { risk: 'READ', approvalRequired: false },
  'postmark.delivery.diagnose': { risk: 'READ', approvalRequired: false },
  'postmark.bounce.search': { risk: 'READ', approvalRequired: false },
  'postmark.stats.get': { risk: 'READ', approvalRequired: false },
  'postmark.template.list': { risk: 'READ', approvalRequired: false },
  'postmark.template.get': { risk: 'READ', approvalRequired: false },
  'postmark.email.send': { risk: 'HIGH_RISK', approvalRequired: true },
  'postmark.template.send': { risk: 'HIGH_RISK', approvalRequired: true },
  'postmark.webhook.list': { risk: 'READ', approvalRequired: false },
  'postmark.webhook.create': { risk: 'HIGH_RISK', approvalRequired: true },
  'postmark.webhook.delete': { risk: 'DESTRUCTIVE', approvalRequired: true }
};

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret: string, tool: string, args: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(args)}`).digest('hex');
}

export function assertApproval(secret: string, tool: string, args: Record<string, unknown>, approval?: string): void {
  const policy = TOOL_POLICY[tool];
  if (!policy?.approvalRequired) return;
  if (!approval) throw new Error(`${tool} requires explicit human approval`);
  const clean = { ...args };
  delete clean.approval;
  const expected = approvalDigest(secret, tool, clean);
  const a = Buffer.from(approval);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
