import crypto from 'node:crypto';
import { approvalToken } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'algolia.index.list': { risk: 'READ', approval: false },
  'algolia.record.search': { risk: 'READ', approval: false },
  'algolia.record.get': { risk: 'READ', approval: false },
  'algolia.facet.search': { risk: 'READ', approval: false },
  'algolia.settings.get': { risk: 'READ', approval: false },
  'algolia.analytics.top_searches': { risk: 'READ', approval: false },
  'algolia.analytics.no_results': { risk: 'READ', approval: false },
  'algolia.record.save': { risk: 'WRITE', approval: true },
  'algolia.settings.set': { risk: 'HIGH_RISK', approval: true },
  'algolia.record.delete': { risk: 'DESTRUCTIVE', approval: true }
};
export function assertApproval(tool: string, payload: unknown, supplied: string | undefined, secret: string | undefined) {
  if (!POLICY[tool]?.approval) return;
  if (!secret) throw new Error(`${tool} requires ALGOLIA_APPROVAL_SECRET`);
  if (!supplied) throw new Error(`${tool} requires explicit approval`);
  const a = Buffer.from(supplied), b = Buffer.from(approvalToken(secret, tool, payload));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
