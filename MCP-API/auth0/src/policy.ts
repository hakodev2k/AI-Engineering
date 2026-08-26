import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'auth0.user.search': { risk: 'READ', approval: false },
  'auth0.user.get': { risk: 'READ', approval: false },
  'auth0.user.create': { risk: 'WRITE', approval: true },
  'auth0.user.update': { risk: 'WRITE', approval: true },
  'auth0.user.delete': { risk: 'DESTRUCTIVE', approval: true },
  'auth0.client.list': { risk: 'READ', approval: false },
  'auth0.connection.list': { risk: 'READ', approval: false },
  'auth0.role.list': { risk: 'READ', approval: false },
  'auth0.log.list': { risk: 'READ', approval: false }
};

export function assertApproval(tool: string, payload: unknown, approvalId: string | undefined, secret?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy?.approval) return;
  if (!secret) throw new Error(`${tool} requires AUTH0_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool, payload);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
