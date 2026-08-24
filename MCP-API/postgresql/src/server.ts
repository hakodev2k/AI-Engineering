import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PostgresClient, qualified, quoteIdent, whereClause, type Scalar } from './client.js';
import { assertTargetAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const db = new PostgresClient(config);
const server = new McpServer({ name: 'postgresql-mcp-connector', version: '1.0.0' });
const ident = z.string().min(1).max(63).regex(/^[A-Za-z_][A-Za-z0-9_$]*$/);
const schema = ident;
const table = ident;
const scalar = z.union([z.string().max(100000), z.number().finite(), z.boolean(), z.null()]);
const record = z.record(ident, scalar);
const nonEmptyRecord = record.refine(v => Object.keys(v).length > 0, 'At least one field is required');
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('postgresql.database.info', 'READ: return current database, role, PostgreSQL version, recovery state and transaction read-only default.', {}, async () => {
  const r = await db.query('SELECT current_database() AS database, current_user AS user, current_setting(\'server_version\') AS server_version, pg_is_in_recovery() AS in_recovery, current_setting(\'default_transaction_read_only\') AS default_transaction_read_only');
  return out(r.rows[0]);
});

server.tool('postgresql.schema.list', 'READ: list allowed non-system schemas visible to the connected role.', {}, async () => {
  const allowed = [...config.allowedSchemas];
  const r = await db.query('SELECT schema_name, schema_owner FROM information_schema.schemata WHERE schema_name <> \'information_schema\' AND schema_name NOT LIKE \'pg_%\' AND ($1::text[] IS NULL OR schema_name = ANY($1::text[])) ORDER BY schema_name', [allowed.length ? allowed : null]);
  return out(r.rows);
});

server.tool('postgresql.table.list', 'READ: list tables/views in an allowed schema.', { schema, includeViews: z.boolean().optional() }, async a => {
  assertTargetAllowed(config, a.schema);
  const types = a.includeViews ? ['BASE TABLE', 'VIEW', 'FOREIGN', 'LOCAL TEMPORARY'] : ['BASE TABLE', 'FOREIGN'];
  const r = await db.query('SELECT table_schema, table_name, table_type, is_insertable_into FROM information_schema.tables WHERE table_schema = $1 AND table_type = ANY($2::text[]) ORDER BY table_name', [a.schema, types]);
  const rows = config.allowedTables.size ? r.rows.filter((x: any) => config.allowedTables.has(String(x.table_name).toLowerCase()) || config.allowedTables.has(`${a.schema.toLowerCase()}.${String(x.table_name).toLowerCase()}`)) : r.rows;
  return out(rows);
});

server.tool('postgresql.table.describe', 'READ: return columns, nullability, defaults, key/unique constraints for an allowed table.', { schema, table }, async a => {
  assertTargetAllowed(config, a.schema, a.table);
  const columns = await db.query('SELECT ordinal_position, column_name, data_type, udt_name, is_nullable, column_default, character_maximum_length, numeric_precision, numeric_scale, is_identity, is_generated FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position', [a.schema, a.table]);
  const constraints = await db.query('SELECT tc.constraint_name, tc.constraint_type, kcu.column_name, kcu.ordinal_position FROM information_schema.table_constraints tc LEFT JOIN information_schema.key_column_usage kcu ON tc.constraint_catalog=kcu.constraint_catalog AND tc.constraint_schema=kcu.constraint_schema AND tc.constraint_name=kcu.constraint_name WHERE tc.table_schema=$1 AND tc.table_name=$2 ORDER BY tc.constraint_name, kcu.ordinal_position', [a.schema, a.table]);
  return out({ columns: columns.rows, constraints: constraints.rows });
});

server.tool('postgresql.index.list', 'READ: list PostgreSQL indexes for an allowed table.', { schema, table }, async a => {
  assertTargetAllowed(config, a.schema, a.table);
  const r = await db.query('SELECT schemaname, tablename, indexname, tablespace, indexdef FROM pg_indexes WHERE schemaname=$1 AND tablename=$2 ORDER BY indexname', [a.schema, a.table]);
  return out(r.rows);
});

server.tool('postgresql.row.select', 'READ: select bounded rows using equality/NULL filters only; arbitrary SQL is not accepted.', {
  schema, table, columns: z.array(ident).min(1).max(50).optional(), filters: record.optional(), orderBy: ident.optional(), direction: z.enum(['asc', 'desc']).optional(), limit: z.number().int().min(1).max(100).optional(), offset: z.number().int().min(0).max(10000).optional()
}, async a => {
  assertTargetAllowed(config, a.schema, a.table);
  const cols = a.columns?.map(quoteIdent).join(', ') ?? '*';
  const where = whereClause(a.filters as Record<string, Scalar> | undefined);
  const order = a.orderBy ? ` ORDER BY ${quoteIdent(a.orderBy)} ${(a.direction ?? 'asc').toUpperCase()}` : '';
  const limit = a.limit ?? 50;
  const offset = a.offset ?? 0;
  const r = await db.query(`SELECT ${cols} FROM ${qualified(a.schema, a.table)}${where.sql}${order} LIMIT ${limit} OFFSET ${offset}`, where.values);
  return out({ rows: r.rows, rowCount: r.rowCount, limit, offset });
});

server.tool('postgresql.row.count', 'READ: count rows using equality/NULL filters only.', { schema, table, filters: record.optional() }, async a => {
  assertTargetAllowed(config, a.schema, a.table);
  const where = whereClause(a.filters as Record<string, Scalar> | undefined);
  const r = await db.query<{ count: string }>(`SELECT count(*)::text AS count FROM ${qualified(a.schema, a.table)}${where.sql}`, where.values);
  return out({ count: r.rows[0]?.count ?? '0' });
});

server.tool('postgresql.row.insert', 'WRITE: insert one row into an allowed table. Requires explicit approval.', { schema, table, values: nonEmptyRecord, returning: z.array(ident).max(20).optional(), approvalId }, async a => {
  assertTargetAllowed(config, a.schema, a.table);
  assertApproval('postgresql.row.insert', a.approvalId, config.approvalSecret);
  const entries = Object.entries(a.values);
  const columns = entries.map(([k]) => quoteIdent(k)).join(', ');
  const placeholders = entries.map((_, i) => `$${i + 1}`).join(', ');
  const returning = a.returning?.length ? ` RETURNING ${a.returning.map(quoteIdent).join(', ')}` : '';
  const r = await db.write(`INSERT INTO ${qualified(a.schema, a.table)} (${columns}) VALUES (${placeholders})${returning}`, entries.map(([, v]) => v));
  return out({ rowCount: r.rowCount, rows: r.rows });
});

server.tool('postgresql.row.update', 'WRITE: update rows matching mandatory equality/NULL filters. Requires explicit approval.', { schema, table, values: nonEmptyRecord, filters: nonEmptyRecord, returning: z.array(ident).max(20).optional(), approvalId }, async a => {
  assertTargetAllowed(config, a.schema, a.table);
  assertApproval('postgresql.row.update', a.approvalId, config.approvalSecret);
  const entries = Object.entries(a.values);
  const set = entries.map(([k], i) => `${quoteIdent(k)} = $${i + 1}`).join(', ');
  const where = whereClause(a.filters as Record<string, Scalar>, entries.length + 1);
  const returning = a.returning?.length ? ` RETURNING ${a.returning.map(quoteIdent).join(', ')}` : '';
  const r = await db.write(`UPDATE ${qualified(a.schema, a.table)} SET ${set}${where.sql}${returning}`, [...entries.map(([, v]) => v), ...where.values]);
  return out({ rowCount: r.rowCount, rows: r.rows });
});

server.tool('postgresql.row.delete', 'DESTRUCTIVE: delete rows matching mandatory equality/NULL filters. Disabled by default and requires explicit approval.', { schema, table, filters: nonEmptyRecord, returning: z.array(ident).max(20).optional(), approvalId }, async a => {
  assertTargetAllowed(config, a.schema, a.table);
  if (!config.enableDelete) throw new Error('postgresql.row.delete is disabled; set POSTGRES_ENABLE_DELETE=true to enable deliberately');
  assertApproval('postgresql.row.delete', a.approvalId, config.approvalSecret);
  const where = whereClause(a.filters as Record<string, Scalar>);
  const returning = a.returning?.length ? ` RETURNING ${a.returning.map(quoteIdent).join(', ')}` : '';
  const r = await db.write(`DELETE FROM ${qualified(a.schema, a.table)}${where.sql}${returning}`, where.values);
  return out({ rowCount: r.rowCount, rows: r.rows });
});

const shutdown = () => { void db.close().finally(() => server.close()).then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
