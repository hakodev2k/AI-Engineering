import crypto from 'node:crypto';
import { approvalToken, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export type ToolPolicy = { risk: Risk; approval: boolean; upstream: string };

export const TOOL_POLICY: Record<string, ToolPolicy> = {
  'resend.email.list': { risk: 'READ', approval: false, upstream: 'list-emails' },
  'resend.email.get': { risk: 'READ', approval: false, upstream: 'get-email' },
  'resend.email.send': { risk: 'HIGH_RISK', approval: true, upstream: 'send-email' },
  'resend.email.cancel': { risk: 'WRITE', approval: true, upstream: 'cancel-email' },
  'resend.received_email.list': { risk: 'READ', approval: false, upstream: 'list-received-emails' },
  'resend.received_email.get': { risk: 'READ', approval: false, upstream: 'get-received-email' },
  'resend.contact.list': { risk: 'READ', approval: false, upstream: 'list-contacts' },
  'resend.contact.get': { risk: 'READ', approval: false, upstream: 'get-contact' },
  'resend.contact.create': { risk: 'WRITE', approval: true, upstream: 'create-contact' },
  'resend.contact.update': { risk: 'WRITE', approval: true, upstream: 'update-contact' },
  'resend.contact.delete': { risk: 'DESTRUCTIVE', approval: true, upstream: 'remove-contact' },
  'resend.domain.list': { risk: 'READ', approval: false, upstream: 'list-domains' },
  'resend.domain.get': { risk: 'READ', approval: false, upstream: 'get-domain' }
};

export function assertApproved(config: Config, tool: string, payload: Record<string, unknown>, provided?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Tool is not allowlisted: ${tool}`);
  const requires = policy.risk === 'HIGH_RISK' || policy.risk === 'DESTRUCTIVE' || (policy.risk === 'WRITE' && config.requireWriteApproval);
  if (!requires) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires RESEND_APPROVAL_SECRET`);
  if (!provided) throw new Error(`${tool} requires explicit human approval`);
  const clean = { ...payload };
  delete clean.approvalToken;
  const expected = approvalToken(config.approvalSecret, tool, clean);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval token for ${tool}`);
}
