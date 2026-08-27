import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'gitguardian.incident.list': { risk: 'READ', approval: false },
  'gitguardian.incident.get': { risk: 'READ', approval: false },
  'gitguardian.incident.locations.list': { risk: 'READ', approval: false },
  'gitguardian.incident.notes.list': { risk: 'READ', approval: false },
  'gitguardian.source.list': { risk: 'READ', approval: false },
  'gitguardian.source.get': { risk: 'READ', approval: false },
  'gitguardian.team.list': { risk: 'READ', approval: false },
  'gitguardian.content.scan': { risk: 'READ', approval: false },
  'gitguardian.incident.note.create': { risk: 'WRITE', approval: true },
  'gitguardian.incident.assign': { risk: 'WRITE', approval: true }
};

export function assertApproval(config: Config, tool: string, resource: string, approvalId?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires GITGUARDIAN_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(config.approvalSecret, tool, resource);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
