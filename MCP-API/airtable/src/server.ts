import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertTargetAllowed, loadConfig } from './config.js';
import { AirtableRestClient } from './rest.js';
import { AirtableMcpClient } from './mcp.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const rest = new AirtableRestClient(config);
const upstream = new AirtableMcpClient(config);
const server = new McpServer({ name: 'airtable-mcp-connector', version: '1.0.0' });
const baseId = z.string().min(3).max(100).regex(/^[A-Za-z0-9_-]+$/);
const tableId = z.string().min(1).max(200);
const recordId = z.string().min(3).max(100).regex(/^[A-Za-z0-9_-]+$/);
const approvalId = z.string().length(64).optional();
const jsonFields = z.record(z.string(), z.unknown());
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const enc = encodeURIComponent;

server.tool('airtable.base.list', 'List bases accessible to the configured Airtable identity. READ.', {
  offset: z.string().max(1000).optional()
}, async a => {
  const viaMcp = await upstream.tryCall(['list_bases', 'airtable_list_bases'], {});
  return out(viaMcp ?? await rest.get('/meta/bases', { offset: a.offset }));
});

server.tool('airtable.base.create', 'Create a base in a workspace. HIGH_RISK; explicit approval required.', {
  workspaceId: z.string().min(3).max(100),
  name: z.string().min(1).max(250),
  tables: z.array(z.object({
    name: z.string().min(1).max(250),
    description: z.string().max(10000).optional(),
    fields: z.array(z.object({ name: z.string().min(1).max(250), type: z.string().min(1).max(100), options: z.record(z.string(), z.unknown()).optional() })).min(1).max(100)
  })).min(1).max(100),
  approvalId
}, async a => {
  assertApproval('airtable.base.create', a.approvalId, config.approvalSecret);
  const payload = { workspaceId: a.workspaceId, name: a.name, tables: a.tables };
  const viaMcp = await upstream.tryCall(['create_base', 'airtable_create_base'], payload);
  return out(viaMcp ?? await rest.post('/meta/bases', payload));
});

server.tool('airtable.schema.get', 'Get all tables and fields in one allowed base. READ.', { baseId }, async a => {
  assertTargetAllowed(config, a.baseId);
  return out(await rest.get(`/meta/bases/${enc(a.baseId)}/tables`));
});

server.tool('airtable.record.list', 'List/filter records in an allowed table. READ. Returns one Airtable page.', {
  baseId, tableId,
  view: z.string().max(200).optional(),
  filterByFormula: z.string().max(4000).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  maxRecords: z.number().int().min(1).max(100).optional(),
  offset: z.string().max(1000).optional()
}, async a => {
  assertTargetAllowed(config, a.baseId, a.tableId);
  const canonical = { baseId: a.baseId, tableId: a.tableId, view: a.view, filterByFormula: a.filterByFormula, pageSize: a.pageSize, offset: a.offset };
  const viaMcp = await upstream.tryCall(['list_records', 'airtable_list_records'], canonical);
  return out(viaMcp ?? await rest.get(`/${enc(a.baseId)}/${enc(a.tableId)}`, {
    view: a.view, filterByFormula: a.filterByFormula, pageSize: a.pageSize, maxRecords: a.maxRecords, offset: a.offset
  }));
});

server.tool('airtable.record.get', 'Get one record from an allowed table. READ.', { baseId, tableId, recordId }, async a => {
  assertTargetAllowed(config, a.baseId, a.tableId);
  const canonical = { baseId: a.baseId, tableId: a.tableId, recordId: a.recordId };
  const viaMcp = await upstream.tryCall(['get_record', 'airtable_get_record'], canonical);
  return out(viaMcp ?? await rest.get(`/${enc(a.baseId)}/${enc(a.tableId)}/${enc(a.recordId)}`));
});

server.tool('airtable.record.create', 'Create up to 10 records. WRITE; explicit approval required.', {
  baseId, tableId,
  records: z.array(z.object({ fields: jsonFields })).min(1).max(10),
  typecast: z.boolean().optional(),
  approvalId
}, async a => {
  assertTargetAllowed(config, a.baseId, a.tableId);
  assertApproval('airtable.record.create', a.approvalId, config.approvalSecret);
  const canonical = { baseId: a.baseId, tableId: a.tableId, records: a.records, typecast: a.typecast };
  const viaMcp = await upstream.tryCall(['create_records', 'airtable_create_records'], canonical);
  return out(viaMcp ?? await rest.post(`/${enc(a.baseId)}/${enc(a.tableId)}`, { records: a.records, typecast: a.typecast ?? false }));
});

server.tool('airtable.record.update', 'Update up to 10 records. WRITE; explicit approval required.', {
  baseId, tableId,
  records: z.array(z.object({ id: recordId, fields: jsonFields })).min(1).max(10),
  typecast: z.boolean().optional(),
  approvalId
}, async a => {
  assertTargetAllowed(config, a.baseId, a.tableId);
  assertApproval('airtable.record.update', a.approvalId, config.approvalSecret);
  const canonical = { baseId: a.baseId, tableId: a.tableId, records: a.records, typecast: a.typecast };
  const viaMcp = await upstream.tryCall(['update_records', 'airtable_update_records'], canonical);
  return out(viaMcp ?? await rest.patch(`/${enc(a.baseId)}/${enc(a.tableId)}`, { records: a.records, typecast: a.typecast ?? false }));
});

server.tool('airtable.record.delete', 'Delete one record. DESTRUCTIVE; explicit approval required.', {
  baseId, tableId, recordId, approvalId
}, async a => {
  assertTargetAllowed(config, a.baseId, a.tableId);
  assertApproval('airtable.record.delete', a.approvalId, config.approvalSecret);
  const canonical = { baseId: a.baseId, tableId: a.tableId, recordId: a.recordId, records: [a.recordId] };
  const viaMcp = await upstream.tryCall(['delete_record', 'delete_records', 'airtable_delete_records'], canonical);
  return out(viaMcp ?? await rest.delete(`/${enc(a.baseId)}/${enc(a.tableId)}/${enc(a.recordId)}`));
});

server.tool('airtable.comment.list', 'List comments on a record. READ.', {
  baseId, tableId, recordId, offset: z.string().max(1000).optional(), pageSize: z.number().int().min(1).max(100).optional()
}, async a => {
  assertTargetAllowed(config, a.baseId, a.tableId);
  return out(await rest.get(`/${enc(a.baseId)}/${enc(a.tableId)}/${enc(a.recordId)}/comments`, { offset: a.offset, pageSize: a.pageSize }));
});

server.tool('airtable.comment.create', 'Create a record comment. WRITE; explicit approval required.', {
  baseId, tableId, recordId, text: z.string().min(1).max(100000), approvalId
}, async a => {
  assertTargetAllowed(config, a.baseId, a.tableId);
  assertApproval('airtable.comment.create', a.approvalId, config.approvalSecret);
  return out(await rest.post(`/${enc(a.baseId)}/${enc(a.tableId)}/${enc(a.recordId)}/comments`, { text: a.text }));
});

const shutdown = () => { void Promise.allSettled([server.close(), upstream.close()]).then(() => process.exit(0)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
