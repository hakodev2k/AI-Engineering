import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertCollectionAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { WeaviateMcpClient } from './mcp.js';
import { WeaviateRestClient } from './rest.js';

const config = loadConfig();
const rest = new WeaviateRestClient(config);
const mcp = new WeaviateMcpClient(config);
const server = new McpServer({ name: 'weaviate-mcp-connector', version: '1.0.0' });
const collection = z.string().min(1).max(128).regex(/^[A-Za-z][A-Za-z0-9_]*$/);
const uuid = z.string().uuid();
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

async function mcpOrRest<T>(tool: string, args: Record<string, unknown>, fallback: () => Promise<T>): Promise<unknown> {
  if (config.mcpEnabled) {
    try {
      const tools = await mcp.listTools();
      if (tools.tools.some(t => t.name === tool)) return await mcp.invoke(tool, args);
    } catch { /* safe official API fallback */ }
  }
  return fallback();
}

server.tool('weaviate.collection.list', 'List collection schemas. READ.', {}, async () => out(await rest.get('/v1/schema')));

server.tool('weaviate.collection.get', 'Get one collection schema/config. READ.', { collection }, async a => {
  assertCollectionAllowed(config, a.collection);
  return out(await mcpOrRest('weaviate-collections-get-config', { collection: a.collection }, async () => {
    const schema = await rest.get<{ classes?: Array<{ class?: string }> }>('/v1/schema');
    return schema.classes?.find(c => c.class === a.collection) ?? null;
  }));
});

server.tool('weaviate.tenant.list', 'List tenants for a multi-tenant collection. READ.', { collection }, async a => {
  assertCollectionAllowed(config, a.collection);
  return out(await mcpOrRest('weaviate-tenants-list', { collection: a.collection }, () => rest.get(`/v1/schema/${encodeURIComponent(a.collection)}/tenants`)));
});

server.tool('weaviate.object.get', 'Get one object by UUID. READ.', { collection, id: uuid }, async a => {
  assertCollectionAllowed(config, a.collection);
  return out(await rest.get(`/v1/objects/${encodeURIComponent(a.collection)}/${encodeURIComponent(a.id)}`));
});

server.tool('weaviate.object.list', 'List objects in a collection with bounded pagination. READ.', {
  collection, limit: z.number().int().min(1).max(100).default(20), after: z.string().uuid().optional()
}, async a => {
  assertCollectionAllowed(config, a.collection);
  const qs = new URLSearchParams({ class: a.collection, limit: String(a.limit) });
  if (a.after) qs.set('after', a.after);
  return out(await rest.get(`/v1/objects?${qs.toString()}`));
});

server.tool('weaviate.search.hybrid', 'Run hybrid keyword/vector search. READ. Uses official MCP when available, otherwise GraphQL.', {
  collection,
  query: z.string().min(1).max(4000),
  alpha: z.number().min(0).max(1).default(0.5),
  limit: z.number().int().min(1).max(50).default(10),
  properties: z.array(z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/)).min(1).max(50)
}, async a => {
  assertCollectionAllowed(config, a.collection);
  return out(await mcpOrRest('weaviate-query-hybrid', { collection: a.collection, query: a.query, alpha: a.alpha, limit: a.limit }, async () => {
    const escaped = a.query.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const gql = `{ Get { ${a.collection}(hybrid:{query:"${escaped}",alpha:${a.alpha}},limit:${a.limit}) { ${a.properties.join(' ')} _additional { id score } } } }`;
    return rest.post('/v1/graphql', { query: gql });
  }));
});

server.tool('weaviate.object.upsert', 'Create or replace an object. WRITE; explicit approval required.', {
  collection,
  id: uuid.optional(),
  properties: z.record(z.string(), z.unknown()),
  vector: z.array(z.number()).max(65536).optional(),
  approvalId
}, async a => {
  assertCollectionAllowed(config, a.collection);
  assertApproval('weaviate.object.upsert', a.approvalId, config.approvalSecret);
  const payload = { class: a.collection, id: a.id, properties: a.properties, vector: a.vector };
  return out(await mcpOrRest('weaviate-objects-upsert', { collection: a.collection, objects: [payload] }, () => a.id ? rest.put(`/v1/objects/${encodeURIComponent(a.collection)}/${encodeURIComponent(a.id)}`, payload) : rest.post('/v1/objects', payload)));
});

server.tool('weaviate.object.delete', 'Delete one object. DESTRUCTIVE; explicit approval required.', { collection, id: uuid, approvalId }, async a => {
  assertCollectionAllowed(config, a.collection);
  assertApproval('weaviate.object.delete', a.approvalId, config.approvalSecret);
  return out(await rest.delete(`/v1/objects/${encodeURIComponent(a.collection)}/${encodeURIComponent(a.id)}`));
});

server.tool('weaviate.health.ready', 'Check Weaviate readiness. READ.', {}, async () => out(await rest.get('/v1/.well-known/ready')));

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
