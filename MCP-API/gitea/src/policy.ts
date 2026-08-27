import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'gitea.repository.search': { risk: 'READ', approval: false },
  'gitea.repository.list_mine': { risk: 'READ', approval: false },
  'gitea.repository.get': { risk: 'READ', approval: false },
  'gitea.repository.branches.list': { risk: 'READ', approval: false },
  'gitea.file.read': { risk: 'READ', approval: false },
  'gitea.issue.list': { risk: 'READ', approval: false },
  'gitea.issue.get': { risk: 'READ', approval: false },
  'gitea.issue.create': { risk: 'WRITE', approval: true },
  'gitea.issue.comment.create': { risk: 'WRITE', approval: true },
  'gitea.pull_request.list': { risk: 'READ', approval: false },
  'gitea.pull_request.get': { risk: 'READ', approval: false },
  'gitea.pull_request.create': { risk: 'WRITE', approval: true }
};

export function assertAllowed(tool: string, approvalId: string | undefined, config: Config): void {
  const p = TOOL_POLICY[tool];
  if (!p) throw new Error(`Unknown tool policy: ${tool}`);
  if (p.risk === 'READ') return;
  if (!config.allowWrites) throw new Error(`${tool} is disabled because GITEA_ALLOW_WRITES is false`);
  if (!p.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires GITEA_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = Buffer.from(approvalDigest(config.approvalSecret, tool));
  const supplied = Buffer.from(approvalId);
  if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) throw new Error(`Invalid approval for ${tool}`);
}
