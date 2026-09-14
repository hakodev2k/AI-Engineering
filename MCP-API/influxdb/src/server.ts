import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { InfluxUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new InfluxUpstream(config);
const server = new McpServer({ name: 'influxdb-mcp-connector', version: '1.0.0' });
const approvalId = z.string().length(64).optional();

function output(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] };
}

server.tool('influxdb.health.get', 'Check InfluxDB health through the official InfluxDB 3 MCP server.', {}, async () => output(await upstream.call('health_check', {})));
server.tool('influxdb.database.list', 'List databases visible to the configured InfluxDB token.', {}, async () => output(await upstream.call('list_databases', {})));

server.tool('influxdb.table.list', 'List tables/measurements in one database.', {
  database: z.string().min(1).max(64)
}, async ({ database }) => output(await upstream.call('list_tables', { db: database })));

server.tool('influxdb.table.describe', 'Describe one table/measurement schema.', {
  database: z.string().min(1).max(64), table: z.string().min(1).max(256)
}, async ({ database, table }) => output(await upstream.call('describe_table', { db: database, table })));

const querySchema = {
  database: z.string().min(1).max(64),
  query: z.string().min(1).max(100000),
  params: z.union([z.record(z.unknown()), z.array(z.unknown())]).optional(),
  format: z.enum(['json', 'jsonl', 'csv', 'pretty', 'parquet']).optional(),
  maxRows: z.number().int().min(1).max(5000).optional(),
  timeoutMs: z.number().int().min(1).max(120000).optional()
};

server.tool('influxdb.query.sql', 'Run bounded read-only SQL. The official MCP server rejects mutation/DDL statements.', querySchema, async (a) => output(await upstream.call('query_sql', { db: a.database, q: a.query, params: a.params, format: a.format, maxRows: a.maxRows, timeoutMs: a.timeoutMs })));
server.tool('influxdb.query.influxql', 'Run bounded read-only InfluxQL. SELECT INTO and destructive statements are rejected upstream.', querySchema, async (a) => output(await upstream.call('query_influxql', { db: a.database, q: a.query, params: a.params, format: a.format, maxRows: a.maxRows, timeoutMs: a.timeoutMs })));

server.tool('influxdb.database.investigate', 'Discover tables and schemas, optionally with bounded samples.', {
  database: z.string().min(1).max(64), includeSamples: z.boolean().optional(), maxTables: z.number().int().min(1).max(100).optional(), sampleRowsPerTable: z.number().int().min(1).max(20).optional()
}, async (a) => output(await upstream.call('investigate_database', { db: a.database, includeSamples: a.includeSamples, maxTables: a.maxTables, sampleRowsPerTable: a.sampleRowsPerTable })));

server.tool('influxdb.data.write', 'Write line protocol data. Requires explicit human approval.', {
  database: z.string().min(1).max(64), data: z.string().min(1).max(5_000_000), precision: z.enum(['nanosecond','microsecond','millisecond','second']), acceptPartial: z.boolean().optional(), noSync: z.boolean().optional(), approvalId
}, async (a) => {
  assertApproval('influxdb.data.write', a.approvalId, config.approvalSecret);
  return output(await upstream.call('write_line_protocol', { database: a.database, data: a.data, precision: a.precision, acceptPartial: a.acceptPartial, noSync: a.noSync }));
});

server.tool('influxdb.database.create', 'Create a database. Requires explicit human approval.', {
  name: z.string().min(1).max(64).regex(/^[a-zA-Z0-9][a-zA-Z0-9\-_/]*$/), description: z.string().max(2000).optional(), maxTables: z.number().int().min(1).optional(), maxColumnsPerTable: z.number().int().min(1).optional(), retentionPeriod: z.number().nonnegative().optional(), approvalId
}, async (a) => {
  assertApproval('influxdb.database.create', a.approvalId, config.approvalSecret);
  const { approvalId: _, ...args } = a;
  return output(await upstream.call('create_database', args));
});

server.tool('influxdb.database.update', 'Update supported database configuration. Requires explicit human approval.', {
  name: z.string().min(1).max(64), newName: z.string().min(1).max(64).optional(), description: z.string().max(2000).optional(), maxTables: z.number().int().min(1).optional(), maxColumnsPerTable: z.number().int().min(1).optional(), retentionPeriod: z.number().nonnegative().optional(), approvalId
}, async (a) => {
  assertApproval('influxdb.database.update', a.approvalId, config.approvalSecret);
  if (a.newName === undefined && a.description === undefined && a.maxTables === undefined && a.maxColumnsPerTable === undefined && a.retentionPeriod === undefined) throw new Error('At least one configuration change is required');
  const { approvalId: _, ...args } = a;
  return output(await upstream.call('update_database', args));
});

server.tool('influxdb.database.delete', 'Delete a database irreversibly. Requires explicit strong human approval.', {
  name: z.string().min(1).max(64), approvalId
}, async (a) => {
  assertApproval('influxdb.database.delete', a.approvalId, config.approvalSecret);
  return output(await upstream.call('delete_database', { name: a.name }));
});

const shutdown = async () => { try { await upstream.close(); await server.close(); process.exit(0); } catch { process.exit(1); } };
process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
await server.connect(new StdioServerTransport());
