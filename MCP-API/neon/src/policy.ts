import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean; upstream: string }> = {
  'neon.project.list': { risk: 'READ', approval: false, upstream: 'list_projects' },
  'neon.project.get': { risk: 'READ', approval: false, upstream: 'describe_project' },
  'neon.project.create': { risk: 'WRITE', approval: true, upstream: 'create_project' },
  'neon.project.delete': { risk: 'DESTRUCTIVE', approval: true, upstream: 'delete_project' },
  'neon.branch.get': { risk: 'READ', approval: false, upstream: 'describe_branch' },
  'neon.branch.create': { risk: 'WRITE', approval: true, upstream: 'create_branch' },
  'neon.branch.delete': { risk: 'DESTRUCTIVE', approval: true, upstream: 'delete_branch' },
  'neon.branch.compute.list': { risk: 'READ', approval: false, upstream: 'list_branch_computes' },
  'neon.database.table.list': { risk: 'READ', approval: false, upstream: 'get_database_tables' },
  'neon.database.table.describe': { risk: 'READ', approval: false, upstream: 'describe_table_schema' },
  'neon.database.query.read': { risk: 'READ', approval: false, upstream: 'run_sql' },
  'neon.database.query.explain': { risk: 'READ', approval: false, upstream: 'explain_sql_statement' },
  'neon.database.query.slow.list': { risk: 'READ', approval: false, upstream: 'list_slow_queries' }
};

export function assertAllowed(tool: string, config: Config, approvalId?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Tool not allowed: ${tool}`);
  if (config.readonly && policy.risk !== 'READ') throw new Error(`${tool} is disabled while NEON_READONLY=true`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires NEON_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(config.approvalSecret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
