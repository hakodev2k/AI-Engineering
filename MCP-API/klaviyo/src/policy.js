import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export const TOOL_POLICY = Object.freeze({
  'klaviyo.profile.list': { risk: 'READ', approval: false },
  'klaviyo.profile.get': { risk: 'READ', approval: false },
  'klaviyo.list.list': { risk: 'READ', approval: false },
  'klaviyo.list.get': { risk: 'READ', approval: false },
  'klaviyo.segment.list': { risk: 'READ', approval: false },
  'klaviyo.segment.get': { risk: 'READ', approval: false },
  'klaviyo.metric.list': { risk: 'READ', approval: false },
  'klaviyo.metric.get': { risk: 'READ', approval: false },
  'klaviyo.event.list': { risk: 'READ', approval: false },
  'klaviyo.event.create': { risk: 'WRITE', approval: true },
  'klaviyo.campaign.list': { risk: 'READ', approval: false },
  'klaviyo.campaign.get': { risk: 'READ', approval: false }
});

export function authorize(config, tool, payload, token) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool: ${tool}`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires KLAVIYO_APPROVAL_SECRET`);
  if (!token) throw new Error(`${tool} requires explicit approval_token`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(token); const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval_token for ${tool}`);
}
