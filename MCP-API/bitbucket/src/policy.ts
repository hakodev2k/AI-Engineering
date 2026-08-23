import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK';

export const TOOL_RISK: Record<string, Risk> = {
  'bitbucket.repository.list': 'READ',
  'bitbucket.repository.get': 'READ',
  'bitbucket.branch.list': 'READ',
  'bitbucket.commit.list': 'READ',
  'bitbucket.source.read': 'READ',
  'bitbucket.pull_request.list': 'READ',
  'bitbucket.pull_request.get': 'READ',
  'bitbucket.pull_request.create': 'WRITE',
  'bitbucket.pull_request.comment': 'WRITE',
  'bitbucket.pull_request.approve': 'WRITE',
  'bitbucket.pull_request.merge': 'HIGH_RISK'
};

export function assertApproval(tool: string, supplied: string | undefined, secret: string | undefined) {
  if (TOOL_RISK[tool] === 'READ') return;
  if (!secret) throw new Error(`Approval secret is not configured for ${tool}`);
  if (!supplied) throw new Error(`Explicit human approval is required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
