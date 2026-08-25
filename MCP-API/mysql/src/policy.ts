import crypto from 'node:crypto';
import type { Config } from './config.js';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'mysql.schema.list': { risk: 'READ', approval: false },
  'mysql.table.list': { risk: 'READ', approval: false },
  'mysql.table.describe': { risk: 'READ', approval: false },
  'mysql.row.select': { risk: 'READ', approval: false },
  'mysql.row.get': { risk: 'READ', approval: false },
  'mysql.query.select': { risk: 'READ', approval: false },
  'mysql.server.health': { risk: 'READ', approval: false },
  'mysql.row.insert': { risk: 'WRITE', approval: true },
  'mysql.row.update': { risk: 'WRITE', approval: true },
  'mysql.row.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function assertPermission(config: Config, tool: string, approval?: { nonce: string; digest: string }) {
  const p = POLICY[tool];
  if (!p) throw new Error(`Unknown tool policy: ${tool}`);
  if (p.risk === 'WRITE' && !config.allowWrites) throw new Error('Write operations are disabled');
  if (p.risk === 'DESTRUCTIVE' && !config.allowDestructive) throw new Error('Destructive operations are disabled');
  if (!p.approval) return;
  if (!config.approvalSecret) throw new Error('MYSQL_APPROVAL_SECRET is required');
  if (!approval?.nonce || !approval.digest) throw new Error('Explicit approval is required');
  const expected = approvalDigest(config.approvalSecret, tool, approval.nonce);
  const a = Buffer.from(approval.digest);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Invalid approval');
}
