import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertNamespaceAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { MongoUpstream } from './upstream.js';

const config = loadConfig();
if (!config.connectionString) throw new Error('MDB_MCP_CONNECTION_STRING is required for database tools');
const upstream = new MongoUpstream(config);
await upstream.connect();

const server = new McpServer({ name: 'mongodb-mcp-connector', version: '1.0.0' });
const connectionId = z.string().min(1).max(200).default('preconfigured');
const database = z.string().min(1).max(128);
const collection = z.string().min(1).max(255);
const jsonObject = z.record(z.string(), z.unknown());
const approvalId = z.string().length(64).optional();
const output = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

function rejectDangerous(value: unknown): void {
  if (Array.isArray(value)) return value.forEach(rejectDangerous);
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (['$where', '$function', '$accumulator', '$out', '$merge'].includes(key)) throw new Error(`Unsafe MongoDB operator is blocked: ${key}`);
    rejectDangerous(nested);
  }
}

async function call(name: string, args: Record<string, unknown>) {
  if (!upstream.has(name)) throw new Error(`Required official MongoDB MCP tool is unavailable: ${name}`);
  return output(await upstream.call(name, args));
}

server.tool('mongodb.database.list', 'List databases through the official MongoDB MCP server.', { connectionId },
  async a => call('list-databases', a));

server.tool('mongodb.collection.list', 'List collections in an allowed database.', { connectionId, database }, async a => {
  assertNamespaceAllowed(config, a.database);
  return call('list-collections', a);
});

server.tool('mongodb.collection.schema', 'Inspect inferred schema information for an allowed collection.', { connectionId, database, collection }, async a => {
  assertNamespaceAllowed(config, a.database, a.collection);
  return call('collection-schema', a);
});

server.tool('mongodb.index.list', 'List indexes for an allowed collection.', { connectionId, database, collection }, async a => {
  assertNamespaceAllowed(config, a.database, a.collection);
  return call('collection-indexes', a);
});

server.tool('mongodb.collection.storage_size', 'Return collection storage-size information.', { connectionId, database, collection }, async a => {
  assertNamespaceAllowed(config, a.database, a.collection);
  return call('collection-storage-size', a);
});

server.tool('mongodb.database.stats', 'Return database statistics.', { connectionId, database }, async a => {
  assertNamespaceAllowed(config, a.database);
  return call('db-stats', a);
});

server.tool('mongodb.document.find', 'Run a bounded read query. Server-side JavaScript and write-producing operators are blocked.', {
  connectionId, database, collection,
  filter: jsonObject.default({}),
  projection: jsonObject.optional(),
  sort: jsonObject.optional(),
  limit: z.number().int().min(1).max(config.maxDocuments).optional()
}, async a => {
  assertNamespaceAllowed(config, a.database, a.collection);
  rejectDangerous(a.filter); rejectDangerous(a.projection); rejectDangerous(a.sort);
  return call('find', { ...a, limit: a.limit ?? config.maxDocuments });
});

server.tool('mongodb.document.count', 'Count documents matching a filter.', {
  connectionId, database, collection, query: jsonObject.default({})
}, async a => {
  assertNamespaceAllowed(config, a.database, a.collection);
  rejectDangerous(a.query);
  return call('count', a);
});

server.tool('mongodb.aggregate.run', 'Run a read-only aggregation pipeline. $out and $merge are blocked.', {
  connectionId, database, collection,
  pipeline: z.array(jsonObject).min(1).max(100),
  responseBytesLimit: z.number().int().min(1024).max(config.maxBytes).optional()
}, async a => {
  assertNamespaceAllowed(config, a.database, a.collection);
  rejectDangerous(a.pipeline);
  return call('aggregate', { ...a, responseBytesLimit: a.responseBytesLimit ?? config.maxBytes });
});

server.tool('mongodb.query.explain', 'Explain a find or aggregation operation for query-planning analysis.', {
  connectionId, database, collection,
  method: z.enum(['find', 'aggregate']),
  filter: jsonObject.optional(),
  pipeline: z.array(jsonObject).max(100).optional(),
  verbosity: z.enum(['queryPlanner', 'executionStats', 'allPlansExecution']).optional()
}, async a => {
  assertNamespaceAllowed(config, a.database, a.collection);
  rejectDangerous(a.filter); rejectDangerous(a.pipeline);
  return call('explain', a);
});

server.tool('mongodb.document.insert_many', 'Insert documents. WRITE; requires explicit human approval and write mode.', {
  connectionId, database, collection,
  documents: z.array(jsonObject).min(1).max(100),
  approvalId
}, async a => {
  assertNamespaceAllowed(config, a.database, a.collection);
  assertApproval(config, 'mongodb.document.insert_many', a.approvalId);
  const { approvalId: _approval, ...args } = a;
  return call('insert-many', args);
});

server.tool('mongodb.document.update_one', 'Update one matching document. WRITE; requires explicit human approval and write mode.', {
  connectionId, database, collection,
  filter: jsonObject,
  update: jsonObject,
  upsert: z.boolean().optional(),
  approvalId
}, async a => {
  assertNamespaceAllowed(config, a.database, a.collection);
  rejectDangerous(a.filter); rejectDangerous(a.update);
  assertApproval(config, 'mongodb.document.update_one', a.approvalId);
  const { approvalId: _approval, ...args } = a;
  return call('update-one', args);
});

const shutdown = () => { void upstream.close().finally(() => server.close()).finally(() => process.exit(0)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
