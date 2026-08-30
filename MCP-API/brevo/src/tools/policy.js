import crypto from 'node:crypto';
import { approvalDigest } from '../auth/config.js';

export const TOOL_POLICY = Object.freeze({
  'brevo.account.get': { risk: 'READ', approval: false },
  'brevo.contact.list': { risk: 'READ', approval: false },
  'brevo.contact.get': { risk: 'READ', approval: false },
  'brevo.contact.create': { risk: 'WRITE', approval: true },
  'brevo.contact.update': { risk: 'WRITE', approval: true },
  'brevo.contact_list.list': { risk: 'READ', approval: false },
  'brevo.campaign.list': { risk: 'READ', approval: false },
  'brevo.campaign.get': { risk: 'READ', approval: false },
  'brevo.campaign.create': { risk: 'WRITE', approval: true },
  'brevo.campaign.send': { risk: 'HIGH_RISK', approval: true },
  'brevo.transactional_email.send': { risk: 'HIGH_RISK', approval: true },
  'brevo.webhook.list': { risk: 'READ', approval: false },
  'brevo.webhook.create': { risk: 'HIGH_RISK', approval: true },
  'brevo.webhook.delete': { risk: 'DESTRUCTIVE', approval: true }
});

export function authorize(config, tool, payload, token) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool: ${tool}`);
  if (policy.risk === 'DESTRUCTIVE' && !config.destructiveEnabled) throw new Error(`${tool} is disabled; set BREVO_ENABLE_DESTRUCTIVE=true`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires BREVO_APPROVAL_SECRET`);
  if (!token) throw new Error(`${tool} requires explicit approval_token`);
  const expected = Buffer.from(approvalDigest(config.approvalSecret, tool, payload));
  const actual = Buffer.from(token);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) throw new Error(`Invalid approval_token for ${tool}`);
}
