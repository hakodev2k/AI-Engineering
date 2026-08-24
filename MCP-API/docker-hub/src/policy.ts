import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'dockerhub.search': 'READ',
  'dockerhub.namespace.list': 'READ',
  'dockerhub.repository.list': 'READ',
  'dockerhub.repository.get': 'READ',
  'dockerhub.repository.create': 'WRITE',
  'dockerhub.repository.update': 'WRITE',
  'dockerhub.tag.list': 'READ',
  'dockerhub.tag.get': 'READ',
  'dockerhub.dockerfile.get': 'READ',
  'dockerhub.dockerfile.set': 'WRITE'
};

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  const risk = TOOL_RISK[tool];
  if (risk === 'READ') return;
  if (!secret) throw new Error(`${tool} requires DOCKER_HUB_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
