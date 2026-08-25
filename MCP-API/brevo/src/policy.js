import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export const POLICY = Object.freeze({
  'brevo.account.get': ['READ', false],
  'brevo.contact.list': ['READ', false],
  'brevo.contact.get': ['READ', false],
  'brevo.contact.create': ['WRITE', true],
  'brevo.contact.update': ['WRITE', true],
  'brevo.contact.delete': ['DESTRUCTIVE', true],
  'brevo.campaign.list': ['READ', false],
  'brevo.campaign.get': ['READ', false],
  'brevo.campaign.create': ['WRITE', true],
  'brevo.email.send': ['HIGH_RISK', true],
  'brevo.webhook.list': ['READ', false],
  'brevo.webhook.create': ['HIGH_RISK', true],
  'brevo.webhook.delete': ['DESTRUCTIVE', true]
});

export function authorize(config, tool, args) {
  const [risk, approval] = POLICY[tool] ?? (() => { throw new Error(`Unregistered policy: ${tool}`); })();
  if (risk === 'WRITE' || risk === 'HIGH_RISK') {
    if (!config.allowWrite) throw new Error(`${tool} is disabled; set BREVO_ALLOW_WRITE=true`);
  }
  if (risk === 'DESTRUCTIVE' && !config.allowDestructive) {
    throw new Error(`${tool} is disabled; set BREVO_ALLOW_DESTRUCTIVE=true`);
  }
  if (!approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires BREVO_APPROVAL_SECRET`);
  const token = args.approvalToken;
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) throw new Error(`${tool} requires an explicit approval token`);
  const expected = approvalDigest(config.approvalSecret, tool, args);
  const a = Buffer.from(token.toLowerCase(), 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Approval token does not match ${tool} arguments`);
}
