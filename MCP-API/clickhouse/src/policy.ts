import { z } from 'zod';
import type { ConnectorConfig } from './config.js';

export const Identifier = z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).max(128);
export const QualifiedTable = z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$/).max(257);

const READ_PREFIX = /^(SELECT|WITH)\b/i;
const FORBIDDEN = /\b(INSERT|ALTER|CREATE|DROP|TRUNCATE|DELETE|UPDATE|OPTIMIZE|SYSTEM|KILL|ATTACH|DETACH|RENAME|GRANT|REVOKE)\b/i;
const NETWORK_TABLE_FUNCTIONS = /\b(url|remote|remoteSecure|s3|s3Cluster|hdfs|azureBlobStorage|azureBlobStorageCluster|mysql|postgresql|jdbc|odbc|mongodb)\s*\(/i;
const FILE_TABLE_FUNCTIONS = /\b(file|input)\s*\(/i;

export function assertReadonlyQuery(sql: string): void {
  const q = sql.trim().replace(/;+\s*$/, '');
  if (!q || !READ_PREFIX.test(q) || FORBIDDEN.test(q) || NETWORK_TABLE_FUNCTIONS.test(q) || FILE_TABLE_FUNCTIONS.test(q) || q.includes(';')) {
    throw new Error('Only one SELECT/WITH statement without mutation, DDL, external-network, or file table functions is allowed.');
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
