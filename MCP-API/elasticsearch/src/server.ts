import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ElasticAgentBuilderClient } from './agent-builder.js';
import { ElasticClient } from './client.js';
import { assertIndexAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const rest = new ElasticClient(config);
const mcp = new ElasticAgentBuilderClient(config);
const server = new McpServer({ name: 'elasticsearch-mcp-connector', version: '1.0.0' });
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const enc = encodeURIComponent;
const index = z.string().min(1).max(255).regex(/^[A-Za-z0-9._*?-]+$/);
const id = z.string().min(1).max(512).refine(v => !v.includes('/'), 'document id cannot contain /');
const approvalId = z.string().length(64).optional();
const queryDsl = z.record(z.string(), z.unknown());

async function preferMcp(tool: string, args: Record<string, unknown>, fallback: () => Promise<unknown>) {
  const result = await mcp.call(tool, args);
  return result ?? fallback();
}

server.tool('elasticsearch.index.list', 'READ: resolve an allowed index, alias, or data-stream pattern.', {
  index
}, async a => {
  assertIndexAllowed(config, a.index);
  return out(await preferMcp('platform.core.list_indices', { index: a.index }, () => rest.get(`/_resolve/index/${enc(a.index)}`)));
});

server.tool('elasticsearch.index.mapping', 'READ: retrieve mapping metadata for an allowed index pattern.', {
  index
}, async a => {
  assertIndexAllowed(config, a.index);
  return out(await preferMcp('platform.core.get_index_mapping', { index: a.index }, () => rest.get(`/${enc(a.index)}/_mapping`)));
});

server.tool('elasticsearch.document.get', 'READ: get one document by ID from an allowed index.', {
  index, id, sourceIncludes: z.array(z.string().min(1).max(200)).max(100).optional()
}, async a => {
  assertIndexAllowed(config, a.index);
  const mcpResult = await mcp.call('platform.core.get_document_by_id', { index: a.index, id: a.id });
  if (mcpResult !== null) return out(mcpResult);
  const query = a.sourceIncludes?.length ? { _source_includes: a.sourceIncludes.join(',') } : undefined;
  return out(await rest.get(`/${enc(a.index)}/_doc/${enc(a.id)}`, query));
});

server.tool('elasticsearch.document.search', 'READ: search an allowed index using bounded Elasticsearch Query DSL.', {
  index,
  query: queryDsl,
  size: z.number().int().min(1).max(100).default(20),
  from: z.number().int().min(0).max(10000).default(0),
  sourceIncludes: z.array(z.string().min(1).max(200)).max(100).optional(),
  sort: z.array(z.record(z.string(), z.enum(['asc', 'desc']))).max(10).optional()
}, async a => {
  assertIndexAllowed(config, a.index);
  return out(await rest.post(`/${enc(a.index)}/_search`, {
    query: a.query,
    size: a.size,
    from: a.from,
    _source: a.sourceIncludes,
    sort: a.sort
  }));
});

server.tool('elasticsearch.search.natural_language', 'READ: natural-language search through the official Elastic Agent Builder MCP server; falls back to match query REST search.', {
  index, query: z.string().min(1).max(4000), size: z.number().int().min(1).max(50).default(10)
}, async a => {
  assertIndexAllowed(config, a.index);
  return out(await preferMcp('platform.core.search', { index: a.index, query: a.query, limit: a.size }, () => rest.post(`/${enc(a.index)}/_search`, {
    size: a.size,
    query: { multi_match: { query: a.query, fields: ['*'], lenient: true } }
  })));
});

server.tool('elasticsearch.esql.query', 'READ: execute a bounded ES|QL query. The query must reference only allowlisted indices.', {
  query: z.string().min(1).max(20000), index: index.describe('Index or pattern referenced by the ES|QL query for allowlist enforcement')
}, async a => {
  assertIndexAllowed(config, a.index);
  const normalized = a.query.toLowerCase();
  if (!normalized.includes(a.index.toLowerCase().replace('*', ''))) throw new Error('Declared index must be referenced by the ES|QL query');
  return out(await preferMcp('platform.core.execute_esql', { esql: a.query, index: a.index }, () => rest.post('/_query', { query: a.query })));
});

server.tool('elasticsearch.document.count', 'READ: count documents matching Query DSL in an allowed index.', {
  index, query: queryDsl
}, async a => {
  assertIndexAllowed(config, a.index);
  return out(await rest.post(`/${enc(a.index)}/_count`, { query: a.query }));
});

server.tool('elasticsearch.document.create', 'WRITE: create a document only if the ID does not already exist. Requires explicit human approval.', {
  index, id, document: z.record(z.string(), z.unknown()), refresh: z.enum(['true', 'false', 'wait_for']).default('false'), approvalId
}, async a => {
  assertIndexAllowed(config, a.index);
  assertApproval('elasticsearch.document.create', a.approvalId, config.approvalSecret);
  return out(await rest.request('PUT', `/${enc(a.index)}/_create/${enc(a.id)}`, a.document, { refresh: a.refresh }, false));
});

server.tool('elasticsearch.document.update', 'WRITE: partially update an existing document. Requires explicit human approval.', {
  index, id, doc: z.record(z.string(), z.unknown()), detectNoop: z.boolean().default(true), refresh: z.enum(['true', 'false', 'wait_for']).default('false'), approvalId
}, async a => {
  assertIndexAllowed(config, a.index);
  assertApproval('elasticsearch.document.update', a.approvalId, config.approvalSecret);
  return out(await rest.request('POST', `/${enc(a.index)}/_update/${enc(a.id)}`, { doc: a.doc, detect_noop: a.detectNoop }, { refresh: a.refresh }, false));
});

server.tool('elasticsearch.document.delete', 'DESTRUCTIVE: delete exactly one document by ID. Requires explicit human approval.', {
  index, id, refresh: z.enum(['true', 'false', 'wait_for']).default('false'), approvalId
}, async a => {
  assertIndexAllowed(config, a.index);
  assertApproval('elasticsearch.document.delete', a.approvalId, config.approvalSecret);
  return out(await rest.request('DELETE', `/${enc(a.index)}/_doc/${enc(a.id)}`, undefined, { refresh: a.refresh }, false));
});

const shutdown = () => { void Promise.all([server.close(), mcp.close()]).then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
