import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'elasticsearch.index.list': 'READ',
  'elasticsearch.index.mapping': 'READ',
  'elasticsearch.document.get': 'READ',
  'elasticsearch.document.search': 'READ',
  'elasticsearch.search.natural_language': 'READ',
  'elasticsearch.esql.query': 'READ',
  'elasticsearch.document.count': 'READ',
  'elasticsearch.document.create': 'WRITE',
  'elasticsearch.document.update': 'WRITE',
  'elasticsearch.document.delete': 'DESTRUCTIVE'
};

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  const risk = TOOL_RISK[tool];
  if (!risk) throw new Error(`Unclassified tool: ${tool}`);
  if (risk === 'READ') return;
  if (!secret) throw new Error(`${tool} requires ELASTIC_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Invalid approval token');
}
