import crypto from 'node:crypto';
import { approvalDigest, type SendGridConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'sendgrid.account.scopes.get': { risk: 'READ', approval: false },
  'sendgrid.sender.list': { risk: 'READ', approval: false },
  'sendgrid.template.list': { risk: 'READ', approval: false },
  'sendgrid.template.get': { risk: 'READ', approval: false },
  'sendgrid.template.create': { risk: 'WRITE', approval: true },
  'sendgrid.template.version.create': { risk: 'WRITE', approval: true },
  'sendgrid.suppression.global.get': { risk: 'READ', approval: false },
  'sendgrid.suppression.global.add': { risk: 'WRITE', approval: true },
  'sendgrid.suppression.global.remove': { risk: 'HIGH_RISK', approval: true },
  'sendgrid.suppression.group.list': { risk: 'READ', approval: false },
  'sendgrid.webhook.event.get': { risk: 'READ', approval: false },
  'sendgrid.webhook.event.update': { risk: 'HIGH_RISK', approval: true },
  'sendgrid.email.send': { risk: 'HIGH_RISK', approval: true }
};

export function assertPolicy(config: SendGridConfig, tool: string, payload: unknown, approvalId?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.risk === 'WRITE' && !config.allowWrites) throw new Error(`${tool} is disabled; set SENDGRID_ALLOW_WRITES=true`);
  if ((policy.risk === 'HIGH_RISK' || policy.risk === 'DESTRUCTIVE') && !config.allowHighRisk) throw new Error(`${tool} is disabled; set SENDGRID_ALLOW_HIGH_RISK=true`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires SENDGRID_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
