import { z } from 'zod';
import type { ConnectorConfig } from './config.js';

export const Identifier = z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).max(128);
export const QualifiedTable = z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$/).max(257);

const READ_PREFIX = /^(SELECT|WITH|SHOW|DESCRIBE|DESC|EXPLAIN)\b/i;
const FORBIDDEN = /\b(INSERT|ALTER|CREATE|DROP|TRUNCATE|DELETE|UPDATE|OPTIMIZE|SYSTEM|KILL|ATTACH|DETACH|RENAME|GRANT|REVOKE)\b/i;

export function assertReadonlyQuery(sql: string): void {
  const q = sql.trim().replace(/;+\s*$/, '');
  if (!q || !READ_PREFIX.test(q) || FORBIDDEN.test(q) || q.includes(';')) {
    throw new Error('Only a single read-only SELECT/WITH/SHOW/DESCRIBE/DESC/EXPLAIN statement is allowed.');
  }
}

export type Approval = { approved?: boolean };
export function requireWrite(config: ConnectorConfig, approval: Approval): void {
  if (!config.allowWrites && approval.approved !== true) throw new Error('WRITE_APPROVAL_REQUIRED');
}
export function requireHighRisk(approval: Approval): void {
  if (approval.approved !== true) throw new Error('HIGH_RISK_APPROVAL_REQUIRED');
}
export function requireDestructive(config: ConnectorConfig, approval: Approval): void {
  if (!config.allowDestructive) throw new Error('DESTRUCTIVE_DISABLED');
  if (approval.approved !== true) throw new Error('DESTRUCTIVE_APPROVAL_REQUIRED');
}

export function quoteIdentifier(id: string): string {
  Identifier.parse(id);
  return `\`${id}\``;
}

export function quoteQualifiedTable(value: string, defaultDb: string): string {
  QualifiedTable.parse(value);
  const [db, table] = value.includes('.') ? value.split('.') : [defaultDb, value];
  return `${quoteIdentifier(db!)}.${quoteIdentifier(table!)}`;
}
