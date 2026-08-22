import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertAllowed, loadConfig } from './config.js';
import { SalesforceUpstream, TOOL_ALIASES } from './upstream.js';

const config = loadConfig();
const upstream = new SalesforceUpstream(config);
const server = new McpServer({ name: 'salesforce-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const ObjectName = z.string().min(1).max(255).regex(/^[A-Za-z][A-Za-z0-9_]*$/);
const RecordId = z.string().min(15).max(18).regex(/^[A-Za-z0-9]+$/);
const Body = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).refine(v => Object.keys(v).length > 0 && Object.keys(v).length <= 100);

server.tool('salesforce.schema.get', 'Describe queryable Salesforce objects or one object. READ.', {
  object_name: ObjectName.optional()
}, async ({ object_name }) => json(await upstream.call('read', TOOL_ALIASES.schema, object_name ? { 'object-name': object_name } : {})));

server.tool('salesforce.record.query', 'Run a bounded SOQL read query. READ. Query must include WHERE and LIMIT.', {
  query: z.string().min(1).max(10000)
}, async ({ query }) => {
  if (!/\bWHERE\b/i.test(query) || !/\bLIMIT\s+\d+/i.test(query)) throw new Error('VALIDATION_ERROR: SOQL must include WHERE and LIMIT');
  return json(await upstream.call('read', TOOL_ALIASES.query, { query }));
});

server.tool('salesforce.record.search', 'Run SOSL text search across allowed Salesforce objects. READ.', {
  search: z.string().min(1).max(10000)
}, async ({ search }) => json(await upstream.call('read', TOOL_ALIASES.search, { search })));

server.tool('salesforce.user.get', 'Get the authenticated Salesforce user context. READ.', {},
  async () => json(await upstream.call('read', TOOL_ALIASES.user, {})));

server.tool('salesforce.record.recent', 'List recently viewed records for one Salesforce object. READ.', {
  object_name: ObjectName
}, async ({ object_name }) => json(await upstream.call('read', TOOL_ALIASES.recent, { 'sobject-name': object_name })));

server.tool('salesforce.record.related.list', 'Read child records through a parent relationship. READ.', {
  object_name: ObjectName,
  id: RecordId,
  relationship_path: z.string().min(1).max(255).regex(/^[A-Za-z][A-Za-z0-9_.]*$/)
}, async ({ object_name, id, relationship_path }) => json(await upstream.call('read', TOOL_ALIASES.relatedList, {
  'sobject-name': object_name, id, 'relationship-path': relationship_path
})));

server.tool('salesforce.record.create', 'Create one Salesforce record. WRITE; operator approval required by default.', {
  object_name: ObjectName,
  body: Body
}, async ({ object_name, body }) => {
  assertAllowed(config, 'salesforce.record.create');
  return json(await upstream.call('mutation', TOOL_ALIASES.create, { 'sobject-name': object_name, body }));
});

server.tool('salesforce.record.update', 'Update selected fields of one Salesforce record. WRITE; operator approval required by default.', {
  object_name: ObjectName,
  id: RecordId,
  body: Body
}, async ({ object_name, id, body }) => {
  assertAllowed(config, 'salesforce.record.update');
  return json(await upstream.call('mutation', TOOL_ALIASES.update, { 'sobject-name': object_name, id, body }));
});

server.tool('salesforce.record.related.update', 'Update a related record through a relationship path. WRITE; operator approval required by default.', {
  object_name: ObjectName,
  id: RecordId,
  relationship_path: z.string().min(1).max(255).regex(/^[A-Za-z][A-Za-z0-9_.]*$/),
  body: Body
}, async ({ object_name, id, relationship_path, body }) => {
  assertAllowed(config, 'salesforce.record.related.update');
  return json(await upstream.call('mutation', TOOL_ALIASES.relatedUpdate, { 'sobject-name': object_name, id, 'relationship-path': relationship_path, body }));
});

server.tool('salesforce.record.delete', 'Delete one Salesforce record to the Recycle Bin. DESTRUCTIVE; strong approval and explicit enablement required.', {
  object_name: ObjectName,
  id: RecordId
}, async ({ object_name, id }) => {
  assertAllowed(config, 'salesforce.record.delete', true);
  return json(await upstream.call('delete', TOOL_ALIASES.delete, { 'sobject-name': object_name, id }));
});

server.tool('salesforce.record.related.delete', 'Delete a related record through a relationship path. DESTRUCTIVE; strong approval and explicit enablement required.', {
  object_name: ObjectName,
  id: RecordId,
  relationship_path: z.string().min(1).max(255).regex(/^[A-Za-z][A-Za-z0-9_.]*$/)
}, async ({ object_name, id, relationship_path }) => {
  assertAllowed(config, 'salesforce.record.related.delete', true);
  return json(await upstream.call('delete', TOOL_ALIASES.relatedDelete, { 'sobject-name': object_name, id, 'relationship-path': relationship_path }));
});

process.on('SIGINT', async () => { await upstream.close(); process.exit(0); });
process.on('SIGTERM', async () => { await upstream.close(); process.exit(0); });
await server.connect(new StdioServerTransport());
