import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SnowflakeClient, inferBinding, quoteIdentifier } from './client.js';
import { assertDatabaseAllowed, assertSchemaAllowed, loadConfig } from './config.js';
import { SnowflakeManagedMcp } from './managed-mcp.js';
import { assertApproval } from './policy.js';
import { TOOL_POLICY } from './tool-policy.js';

const config = loadConfig();
const client = new SnowflakeClient(config);
const managedMcp = new SnowflakeManagedMcp(config);
const server = new McpServer({ name: 'snowflake-mcp-connector', version: '1.0.0' });
const identifier = z.string().min(1).max(255).regex(/^[A-Za-z_][A-Za-z0-9_$]*$/);
const statementHandle = z.string().uuid();
const approvalId = z.string().length(64).optional();
const output = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

function description(name: string, purpose: string) {
  const p = TOOL_POLICY[name];
  return `${purpose} Permission: ${p.permission}. Risk: ${p.risk}. Approval: ${p.approvalRequired ? 'required' : 'not required'}. Output: ${p.output}. Errors: ${p.errors.join(', ')}.`;
}

function normalizeReadSql(sql: string) {
  const trimmed = sql.trim().replace(/;\s*$/, '');
  if (!trimmed || trimmed.length > 100000) throw new Error('SQL must be 1..100000 characters');
  if (trimmed.includes(';')) throw new Error('Only one SQL statement is allowed');
  const withoutLeadingComments = trimmed.replace(/^(?:\s*--[^\n]*\n|\s*\/\*[\s\S]*?\*\/\s*)+/g, '').trim();
  if (!/^(SELECT|SHOW|DESCRIBE|DESC|EXPLAIN)\b/i.test(withoutLeadingComments)) {
    throw new Error('Only read-only SELECT, SHOW, DESCRIBE/DESC, or EXPLAIN statements are allowed');
  }
  if (/\b(CALL|INSERT|UPDATE|DELETE|MERGE|CREATE|ALTER|DROP|TRUNCATE|GRANT|REVOKE|PUT|REMOVE|COPY\s+INTO)\b/i.test(withoutLeadingComments)) {
    throw new Error('Potentially mutating SQL is not allowed by snowflake.query.execute_read');
  }
  return trimmed;
}

async function executeReadPreferMcp(sql: string, context: { database?: string; schema?: string; warehouse?: string; role?: string; timeout?: number } = {}, async = false) {
  if (!async && managedMcp.isConfigured()) {
    try {
      const result = await managedMcp.executeRead(sql);
      if (result !== undefined) return { transport: 'mcp', result };
    } catch {
      // Trusted MCP is preferred, but REST is the documented fallback for unavailable/incompatible MCP calls.
    }
  }
  return { transport: 'rest', result: await client.execute(sql, context, undefined, async, true) };
}

server.tool('snowflake.database.list', description('snowflake.database.list', 'List databases visible to the authenticated Snowflake role.'), {
  limit: z.number().int().min(1).max(1000).optional()
}, async a => output(await executeReadPreferMcp(`SHOW DATABASES${a.limit ? ` LIMIT ${a.limit}` : ''}`)));

server.tool('snowflake.schema.list', description('snowflake.schema.list', 'List schemas in an allowed database.'), {
  database: identifier,
  limit: z.number().int().min(1).max(1000).optional()
}, async a => {
  assertDatabaseAllowed(config, a.database);
  return output(await executeReadPreferMcp(`SHOW SCHEMAS IN DATABASE ${quoteIdentifier(a.database)}${a.limit ? ` LIMIT ${a.limit}` : ''}`));
});

server.tool('snowflake.table.list', description('snowflake.table.list', 'List tables in an allowed database schema.'), {
  database: identifier,
  schema: identifier,
  limit: z.number().int().min(1).max(1000).optional()
}, async a => {
  assertSchemaAllowed(config, a.database, a.schema);
  const q = `SHOW TABLES IN SCHEMA ${quoteIdentifier(a.database)}.${quoteIdentifier(a.schema)}${a.limit ? ` LIMIT ${a.limit}` : ''}`;
  return output(await executeReadPreferMcp(q));
});

server.tool('snowflake.table.describe', description('snowflake.table.describe', 'Describe columns and metadata for an allowed table.'), {
  database: identifier,
  schema: identifier,
  table: identifier
}, async a => {
  assertSchemaAllowed(config, a.database, a.schema);
  const q = `DESCRIBE TABLE ${quoteIdentifier(a.database)}.${quoteIdentifier(a.schema)}.${quoteIdentifier(a.table)}`;
  return output(await executeReadPreferMcp(q));
});

server.tool('snowflake.table.sample', description('snowflake.table.sample', 'Read a bounded sample of rows from an allowed table.'), {
  database: identifier,
  schema: identifier,
  table: identifier,
  limit: z.number().int().min(1).max(200).default(20)
}, async a => {
  assertSchemaAllowed(config, a.database, a.schema);
  const q = `SELECT * FROM ${quoteIdentifier(a.database)}.${quoteIdentifier(a.schema)}.${quoteIdentifier(a.table)} LIMIT ${a.limit}`;
  return output(await executeReadPreferMcp(q, { database: a.database, schema: a.schema }));
});

server.tool('snowflake.warehouse.list', description('snowflake.warehouse.list', 'List warehouses visible to the authenticated role.'), {}, async () => {
  return output(await executeReadPreferMcp('SHOW WAREHOUSES'));
});

server.tool('snowflake.query.execute_read', description('snowflake.query.execute_read', 'Execute one explicitly read-only SQL statement; uses official managed MCP when compatible and REST SQL API otherwise.'), {
  sql: z.string().min(1).max(100000),
  database: identifier.optional(),
  schema: identifier.optional(),
  warehouse: identifier.optional(),
  role: identifier.optional(),
  timeoutSeconds: z.number().int().min(1).max(600).optional(),
  async: z.boolean().optional()
}, async a => {
  const sql = normalizeReadSql(a.sql);
  if (a.database) assertDatabaseAllowed(config, a.database);
  if (a.database && a.schema) assertSchemaAllowed(config, a.database, a.schema);
  return output(await executeReadPreferMcp(sql, { database: a.database, schema: a.schema, warehouse: a.warehouse, role: a.role, timeout: a.timeoutSeconds }, a.async ?? false));
});

server.tool('snowflake.query.status', description('snowflake.query.status', 'Get current status or the first result partition for a previously submitted SQL API statement.'), {
  statementHandle
}, async a => output(await client.status(a.statementHandle)));

server.tool('snowflake.query.partition.get', description('snowflake.query.partition.get', 'Retrieve one bounded Snowflake-managed result partition by partition number.'), {
  statementHandle,
  partition: z.number().int().min(0).max(100000)
}, async a => output(await client.status(a.statementHandle, a.partition)));

server.tool('snowflake.query.cancel', description('snowflake.query.cancel', 'Cancel an in-flight Snowflake SQL API statement.'), {
  statementHandle,
  approvalId
}, async a => {
  assertApproval('snowflake.query.cancel', a.approvalId, config.approvalSecret);
  return output(await client.cancel(a.statementHandle));
});

server.tool('snowflake.row.insert', description('snowflake.row.insert', 'Insert exactly one row with parameter bindings into an allowed table.'), {
  database: identifier,
  schema: identifier,
  table: identifier,
  values: z.record(identifier, z.union([z.string().max(100000), z.number().finite(), z.boolean()])).refine(v => Object.keys(v).length >= 1 && Object.keys(v).length <= 50, 'values must contain 1..50 columns'),
  warehouse: identifier.optional(),
  role: identifier.optional(),
  approvalId
}, async a => {
  assertSchemaAllowed(config, a.database, a.schema);
  assertApproval('snowflake.row.insert', a.approvalId, config.approvalSecret);
  const entries = Object.entries(a.values);
  const columns = entries.map(([name]) => quoteIdentifier(name)).join(', ');
  const placeholders = entries.map(() => '?').join(', ');
  const bindings = Object.fromEntries(entries.map(([, value], i) => [String(i + 1), inferBinding(value)]));
  const sql = `INSERT INTO ${quoteIdentifier(a.database)}.${quoteIdentifier(a.schema)}.${quoteIdentifier(a.table)} (${columns}) VALUES (${placeholders})`;
  return output(await client.execute(sql, { database: a.database, schema: a.schema, warehouse: a.warehouse, role: a.role }, bindings, false, false));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
