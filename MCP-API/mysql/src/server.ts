import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { MySqlClient } from './client.js';
import { assertPermission } from './policy.js';

const config = loadConfig();
const client = new MySqlClient(config);
const server = new McpServer({ name: 'mysql-mcp-connector', version: '1.0.0' });
const ident = z.string().min(1).max(64).regex(/^[A-Za-z_][A-Za-z0-9_$]*$/);
const scalar = z.union([z.string().max(100000), z.number(), z.boolean(), z.null()]);
const approval = { nonce: z.string().min(8).max(200).optional(), digest: z.string().length(64).optional() };
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const approvalObj = (a: { nonce?: string; digest?: string }) => a.nonce && a.digest ? { nonce: a.nonce, digest: a.digest } : undefined;

server.tool('mysql.server.health', 'Check connectivity and return server version/current user/default database. READ.', {}, async () => out(await client.health()));
server.tool('mysql.schema.list', 'List schemas visible to the configured MySQL account. READ.', {}, async () => out(await client.listSchemas()));
server.tool('mysql.table.list', 'List tables and views in a schema. READ.', { schema: ident }, async a => out(await client.listTables(a.schema)));
server.tool('mysql.table.describe', 'Describe columns for one table. READ.', { schema: ident, table: ident }, async a => out(await client.describeTable(a.schema, a.table)));
server.tool('mysql.row.select', 'Select rows using equality filters only. READ; result count is capped.', {
  schema: ident, table: ident,
  filters: z.array(z.object({ column: ident, value: scalar })).max(20).optional(),
  limit: z.number().int().min(1).max(config.maxRows).optional()
}, async a => out(await client.selectRows(a.schema, a.table, a.filters ?? [], a.limit ?? 50)));
server.tool('mysql.row.get', 'Read one row by a key column/value. READ.', {
  schema: ident, table: ident, keyColumn: ident, keyValue: scalar
}, async a => out(await client.getRow(a.schema, a.table, a.keyColumn, a.keyValue)));
server.tool('mysql.query.select', 'Execute a single read-only SELECT/SHOW/EXPLAIN/DESCRIBE statement with positional parameters. READ. SQL comments and multiple statements are rejected.', {
  query: z.string().min(1).max(20000), params: z.array(scalar).max(200).optional()
}, async a => out(await client.readQuery(a.query, a.params ?? [])));
server.tool('mysql.row.insert', 'Insert one row. WRITE; disabled by default and requires explicit approval.', {
  schema: ident, table: ident, values: z.record(ident, scalar), ...approval
}, async a => { assertPermission(config, 'mysql.row.insert', approvalObj(a)); return out(await client.insertRow(a.schema, a.table, a.values)); });
server.tool('mysql.row.update', 'Update at most one row selected by a key column/value. WRITE; disabled by default and requires explicit approval.', {
  schema: ident, table: ident, keyColumn: ident, keyValue: scalar, values: z.record(ident, scalar), ...approval
}, async a => { assertPermission(config, 'mysql.row.update', approvalObj(a)); return out(await client.updateRow(a.schema, a.table, a.keyColumn, a.keyValue, a.values)); });
server.tool('mysql.row.delete', 'Delete at most one row selected by a key column/value. DESTRUCTIVE; disabled by default and requires explicit approval.', {
  schema: ident, table: ident, keyColumn: ident, keyValue: scalar, ...approval
}, async a => { assertPermission(config, 'mysql.row.delete', approvalObj(a)); return out(await client.deleteRow(a.schema, a.table, a.keyColumn, a.keyValue)); });

const shutdown = () => { void server.close().finally(() => process.exit(0)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
