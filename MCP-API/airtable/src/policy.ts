import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'airtable.base.list': { risk: 'READ', approval: false },
  'airtable.schema.get': { risk: 'READ', approval: false },
  'airtable.record.list': { risk: 'READ', approval: false },
  'airtable.record.get': { risk: 'READ', approval: false },
  'airtable.record.create': { risk: 'WRITE', approval: true },
  'airtable.record.update': { risk: 'WRITE', approval: true },
  'airtable.record.delete': { risk: 'DESTRUCTIVE', approval: true },
  'airtable.comment.list': { risk: 'READ', approval: false },
  'airtable.comment.create': { risk: 'WRITE', approval: true },
  'airtable.webhook.list': { risk: 'READ', approval: false },
  'airtable.webhook.create': { risk: 'HIGH_RISK', approval: true },
  'airtable.webhook.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function assertApproval(tool: string, approvalId: string | undefined, secret?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy?.approval) return;
  if (!secret) throw new Error(`${tool} requires AIRTABLE_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
