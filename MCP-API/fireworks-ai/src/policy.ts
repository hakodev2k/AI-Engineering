import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICIES: Record<string, { risk: Risk; approval: boolean; permission: string }> = {
  'fireworks.model.list': { risk: 'READ', approval: false, permission: 'models.read' },
  'fireworks.model.get': { risk: 'READ', approval: false, permission: 'models.read' },
  'fireworks.deployment.list': { risk: 'READ', approval: false, permission: 'deployments.read' },
  'fireworks.deployment.get': { risk: 'READ', approval: false, permission: 'deployments.read' },
  'fireworks.chat.create': { risk: 'WRITE', approval: true, permission: 'inference.execute' },
  'fireworks.completion.create': { risk: 'WRITE', approval: true, permission: 'inference.execute' },
  'fireworks.response.create': { risk: 'WRITE', approval: true, permission: 'responses.write' },
  'fireworks.response.list': { risk: 'READ', approval: false, permission: 'responses.read' },
  'fireworks.embedding.create': { risk: 'WRITE', approval: true, permission: 'inference.execute' },
  'fireworks.rerank.create': { risk: 'WRITE', approval: true, permission: 'inference.execute' },
  'fireworks.deployment.create': { risk: 'HIGH_RISK', approval: true, permission: 'deployments.write' }
};

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  const policy = TOOL_POLICIES[tool];
  if (!policy?.approval) return;
  if (!secret) throw new Error(`${tool} requires approval but FIREWORKS_APPROVAL_SECRET is not configured`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(secret, tool);
  const actual = Buffer.from(approvalId, 'utf8');
  const exp = Buffer.from(expected, 'utf8');
  if (actual.length !== exp.length || !crypto.timingSafeEqual(actual, exp)) throw new Error(`Invalid approvalId for ${tool}`);
}
