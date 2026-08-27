import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface ToolPolicy {
  risk: Risk;
  approvalRequired: boolean;
  scope: string;
}

export const TOOL_POLICY: Record<string, ToolPolicy> = {
  'buildkite.organization.get': { risk: 'READ', approvalRequired: false, scope: 'read_organizations' },
  'buildkite.pipeline.list': { risk: 'READ', approvalRequired: false, scope: 'read_pipelines' },
  'buildkite.pipeline.get': { risk: 'READ', approvalRequired: false, scope: 'read_pipelines' },
  'buildkite.build.list': { risk: 'READ', approvalRequired: false, scope: 'read_builds' },
  'buildkite.build.get': { risk: 'READ', approvalRequired: false, scope: 'read_builds' },
  'buildkite.build.create': { risk: 'WRITE', approvalRequired: true, scope: 'write_builds' },
  'buildkite.build.cancel': { risk: 'HIGH_RISK', approvalRequired: true, scope: 'write_builds' },
  'buildkite.build.rebuild': { risk: 'WRITE', approvalRequired: true, scope: 'write_builds' },
  'buildkite.job.list': { risk: 'READ', approvalRequired: false, scope: 'read_builds' },
  'buildkite.job.get': { risk: 'READ', approvalRequired: false, scope: 'read_builds' },
  'buildkite.job.retry': { risk: 'WRITE', approvalRequired: true, scope: 'write_builds' },
  'buildkite.job.unblock': { risk: 'HIGH_RISK', approvalRequired: true, scope: 'write_builds' },
  'buildkite.logs.search': { risk: 'READ', approvalRequired: false, scope: 'read_build_logs' },
  'buildkite.logs.read': { risk: 'READ', approvalRequired: false, scope: 'read_build_logs' },
  'buildkite.artifact.list': { risk: 'READ', approvalRequired: false, scope: 'read_artifacts' },
  'buildkite.artifact.delete': { risk: 'DESTRUCTIVE', approvalRequired: true, scope: 'write_artifacts' },
  'buildkite.annotation.list': { risk: 'READ', approvalRequired: false, scope: 'read_builds' },
  'buildkite.annotation.create': { risk: 'WRITE', approvalRequired: true, scope: 'write_builds' }
};

export function intentFor(args: unknown): string {
  return JSON.stringify(args, Object.keys((args && typeof args === 'object') ? args as object : {}).sort());
}

export function assertApproval(tool: string, args: unknown, approvalId: string | undefined, secret?: string): void {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approvalRequired) return;
  if (!secret) throw new Error(`${tool} requires BUILDKITE_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(secret, tool, intentFor(args));
  const a = Buffer.from(approvalId, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
