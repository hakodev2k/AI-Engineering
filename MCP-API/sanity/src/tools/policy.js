import crypto from 'node:crypto';
import { approvalDigest } from '../auth/config.js';

export const TOOL_POLICY = Object.freeze({
  'sanity.content.query': { risk: 'READ', approval: false },
  'sanity.document.get': { risk: 'READ', approval: false },
  'sanity.schema.get': { risk: 'READ', approval: false },
  'sanity.schema.list': { risk: 'READ', approval: false },
  'sanity.release.list': { risk: 'READ', approval: false },
  'sanity.document.create_draft': { risk: 'WRITE', approval: true },
  'sanity.document.patch': { risk: 'WRITE', approval: true },
  'sanity.document.publish': { risk: 'HIGH_RISK', approval: true },
  'sanity.document.unpublish': { risk: 'HIGH_RISK', approval: true },
  'sanity.document.discard_draft': { risk: 'DESTRUCTIVE', approval: true }
});
export function authorize(config, tool, payload, approvalToken) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool: ${tool}`);
  if (policy.risk === 'DESTRUCTIVE' && !config.destructiveEnabled) throw new Error(`${tool} is disabled; set SANITY_ENABLE_DESTRUCTIVE=true to enable it`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires SANITY_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${tool} requires explicit approval_token`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalToken), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) throw new Error(`Invalid approval_token for ${tool}`);
}
