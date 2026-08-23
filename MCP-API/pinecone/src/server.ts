import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PineconeClient } from './client.js';
import { assertAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new PineconeClient(config);
const server = new McpServer({ name: 'pinecone-mcp-connector', version: '1.0.0' });
const indexName = z.string().min(1).max(128).regex(/^[a-z0-9-]+$/);
const namespace = z.string().max(512).optional();
const approvalId = z.string().length(64).optional();
const id = z.string().min(1).max(512);
const metadata = z.record(z.string(), z.unknown()).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('pinecone.index.list', 'List Pinecone indexes visible to the configured API key.', {}, async () => {
  const r = await client.withTimeout(client.pc.listIndexes());
  return out(r);
});

server.tool('pinecone.index.get', 'Describe one allowed Pinecone index.', { index: indexName }, async a => {
  assertAllowed(config, a.index);
  return out(await client.withTimeout(client.pc.describeIndex(a.index)));
});

server.tool('pinecone.index.stats', 'Describe vector and namespace statistics for an index.', { index: indexName }, async a => {
  assertAllowed(config, a.index);
  return out(await client.withTimeout(client.index(a.index).describeIndexStats()));
});

server.tool('pinecone.namespace.list', 'List namespaces in an index.', { index: indexName, limit: z.number().int().min(1).max(100).optional(), prefix: z.string().max(512).optional() }, async a => {
  assertAllowed(config, a.index);
  const i = client.index(a.index);
  return out(await client.withTimeout(i.listNamespacesPaginated({ limit: a.limit, prefix: a.prefix })));
});

server.tool('pinecone.record.fetch', 'Fetch records by ID from a namespace.', { index: indexName, namespace, ids: z.array(id).min(1).max(100) }, async a => {
  assertAllowed(config, a.index, a.namespace);
  return out(await client.withTimeout(client.index(a.index).fetch({ ids: a.ids, namespace: a.namespace })));
});

server.tool('pinecone.record.search', 'Vector similarity search in an allowed index/namespace.', {
  index: indexName, namespace, vector: z.array(z.number().finite()).min(1).max(20000), topK: z.number().int().min(1).max(100), includeMetadata: z.boolean().optional(), includeValues: z.boolean().optional(), filter: z.record(z.string(), z.unknown()).optional()
}, async a => {
  assertAllowed(config, a.index, a.namespace);
  return out(await client.withTimeout(client.index(a.index).query({ vector: a.vector, topK: a.topK, namespace: a.namespace, includeMetadata: a.includeMetadata ?? true, includeValues: a.includeValues ?? false, filter: a.filter })));
});

server.tool('pinecone.record.list', 'List record IDs from a namespace with optional prefix.', {
  index: indexName, namespace, prefix: z.string().max(512).optional(), limit: z.number().int().min(1).max(100).optional(), paginationToken: z.string().max(4096).optional()
}, async a => {
  assertAllowed(config, a.index, a.namespace);
  return out(await client.withTimeout(client.index(a.index).listPaginated({ namespace: a.namespace, prefix: a.prefix, limit: a.limit, paginationToken: a.paginationToken })));
});

server.tool('pinecone.record.upsert', 'Upsert vectors. WRITE; requires explicit approval.', {
  index: indexName, namespace, records: z.array(z.object({ id, values: z.array(z.number().finite()).min(1).max(20000), metadata })).min(1).max(100), approvalId
}, async a => {
  assertAllowed(config, a.index, a.namespace); assertApproval('pinecone.record.upsert', a.approvalId, config.approvalSecret);
  return out(await client.withTimeout(client.index(a.index).upsert({ namespace: a.namespace, records: a.records })));
});

server.tool('pinecone.record.update', 'Update one vector and/or metadata. WRITE; requires explicit approval.', {
  index: indexName, namespace, id, values: z.array(z.number().finite()).min(1).max(20000).optional(), metadata, approvalId
}, async a => {
  assertAllowed(config, a.index, a.namespace); assertApproval('pinecone.record.update', a.approvalId, config.approvalSecret);
  if (!a.values && !a.metadata) throw new Error('values or metadata is required');
  return out(await client.withTimeout(client.index(a.index).update({ id: a.id, values: a.values, metadata: a.metadata, namespace: a.namespace })));
});

server.tool('pinecone.record.delete', 'Delete records by ID. DESTRUCTIVE; requires explicit approval.', {
  index: indexName, namespace, ids: z.array(id).min(1).max(100), approvalId
}, async a => {
  assertAllowed(config, a.index, a.namespace); assertApproval('pinecone.record.delete', a.approvalId, config.approvalSecret);
  return out(await client.withTimeout(client.index(a.index).deleteMany({ ids: a.ids, namespace: a.namespace })));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
