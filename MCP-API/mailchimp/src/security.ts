import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approvalRequired: boolean }> = {
  'mailchimp.account.get': { risk: 'READ', approvalRequired: false },
  'mailchimp.audience.list': { risk: 'READ', approvalRequired: false },
  'mailchimp.audience.get': { risk: 'READ', approvalRequired: false },
  'mailchimp.member.list': { risk: 'READ', approvalRequired: false },
  'mailchimp.member.get': { risk: 'READ', approvalRequired: false },
  'mailchimp.member.upsert': { risk: 'WRITE', approvalRequired: true },
  'mailchimp.member.archive': { risk: 'DESTRUCTIVE', approvalRequired: true },
  'mailchimp.member.tags.update': { risk: 'WRITE', approvalRequired: true },
  'mailchimp.campaign.list': { risk: 'READ', approvalRequired: false },
  'mailchimp.campaign.get': { risk: 'READ', approvalRequired: false },
  'mailchimp.campaign.create': { risk: 'WRITE', approvalRequired: true },
  'mailchimp.campaign.update': { risk: 'WRITE', approvalRequired: true },
  'mailchimp.campaign.content.update': { risk: 'WRITE', approvalRequired: true },
  'mailchimp.campaign.send': { risk: 'HIGH_RISK', approvalRequired: true },
  'mailchimp.report.get': { risk: 'READ', approvalRequired: false }
};

function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj).sort().map(k => `${JSON.stringify(k)}:${canonical(obj[k])}`).join(',')}}`;
}

export function approvalPayload(tool: string, args: Record<string, unknown>): string {
  const clean = { ...args };
  delete clean.approvalToken;
  return `${tool}\n${canonical(clean)}`;
}

export function createApprovalToken(secret: string, tool: string, args: Record<string, unknown>): string {
  return crypto.createHmac('sha256', secret).update(approvalPayload(tool, args)).digest('hex');
}

export function assertApproval(tool: string, args: Record<string, unknown>, secret?: string): void {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approvalRequired) return;
  if (!secret) throw new Error(`${tool} requires MAILCHIMP_APPROVAL_SECRET`);
  const token = args.approvalToken;
  if (typeof token !== 'string' || token.length !== 64) throw new Error(`${tool} requires explicit approval`);
  const expected = createApprovalToken(secret, tool, args);
  const a = Buffer.from(token, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}

export function subscriberHash(email: string): string {
  return crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
}
