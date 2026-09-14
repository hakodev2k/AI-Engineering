import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { BaserowClient } from './client.js';
import { assertTableAllowed, loadConfig } from './config.js';
import { assertApproval, assertDeleteEnabled, assertWriteApproval } from './policy.js';

const config = loadConfig();
const client = new BaserowClient(config);
const server = new McpServer({ name: 'baserow-mcp-connector', version: '1.0.0' });
const tableId = z.number().int().positive();
const rowId = z.number().int().positive();
const approvalId = z.string().regex(/^[a-fA-F0-9]{64}$/).optional();
const fields = z.record(z.string().min(1).max(255), z.unknown());

function out(value: unknown) {
  const text = JSON.stringify(value);
  if (text.length > 200_000) throw new Error('Baserow response exceeded the 200 KB connector output limit; narrow the query or page size');
  return { content: [{ type: 'text' as const, text }] };
}

server.tool('baserow.table.list', 'List tables visible to the configured database token. READ. Results are filtered by BASEROW_ALLOWED_TABLE_IDS when configured.', {}, async () => {
  const value = await client.request<unknown>('GET', '/api/database/tables/all-tables/');
  if (config.allowedTableIds.size === 0 || !Array.isArray(value)) return out(value);
  return out(value.filter((item: any) => typeof item?.id === 'number' && config.allowedTableIds.has(item.id)));
});

server.tool('baserow.field.list', 'List field schema for one allowed table. READ.', { tableId }, async ({ tableId }) => {
  assertTableAllowed(config, tableId);
  return out(await client.request('GET', `/api/database/fields/table/${tableId}/`));
});

server.tool('baserow.row.list', 'List/search rows from one allowed table with bounded pagination and Baserow filter/search/order query parameters. READ.', {
  tableId,
  page: z.number().int().min(1).max(100000).optional(),
  size: z.number().int().min(1).max(200).optional(),
  search: z.string().max(1000).optional(),
  orderBy: z.string().max(1000).optional(),
  filters: z.string().max(4000).optional(),
  userFieldNames: z.boolean().optional()
}, async (a) => {
  assertTableAllowed(config, a.tableId);
  return out(await client.request('GET', `/api/database/rows/table/${a.tableId}/`, { query: {
    page: a.page ?? 1, size: a.size ?? 100, search: a.search, order_by: a.orderBy, filters: a.filters, user_field_names: a.userFieldNames ?? true
  }}));
});

server.tool('baserow.row.get', 'Get one row by ID from an allowed table. READ.', {
  tableId, rowId, userFieldNames: z.boolean().optional()
}, async (a) => {
  assertTableAllowed(config, a.tableId);
  return out(await client.request('GET', `/api/database/rows/table/${a.tableId}/${a.rowId}/`, { query: { user_field_names: a.userFieldNames ?? true } }));
});

server.tool('baserow.row.create', 'Create one row in an allowed table. WRITE. Approval is required by default.', {
  tableId, fields, userFieldNames: z.boolean().optional(), beforeRowId: z.number().int().positive().optional(), approvalId
}, async (a) => {
  assertTableAllowed(config, a.tableId);
  assertWriteApproval(config, 'baserow.row.create', `table:${a.tableId}`, a.approvalId);
  return out(await client.request('POST', `/api/database/rows/table/${a.tableId}/`, {
    query: { user_field_names: a.userFieldNames ?? true, before: a.beforeRowId }, body: a.fields, retryable: false
  }));
});

server.tool('baserow.row.update', 'Patch fields on one row in an allowed table. WRITE. Approval is required by default.', {
  tableId, rowId, fields, userFieldNames: z.boolean().optional(), approvalId
}, async (a) => {
  assertTableAllowed(config, a.tableId);
  assertWriteApproval(config, 'baserow.row.update', `table:${a.tableId}:row:${a.rowId}`, a.approvalId);
  return out(await client.request('PATCH', `/api/database/rows/table/${a.tableId}/${a.rowId}/`, {
    query: { user_field_names: a.userFieldNames ?? true }, body: a.fields, retryable: false
  }));
});

server.tool('baserow.row.move', 'Move a row before another row (or to the end when beforeRowId is omitted). WRITE. Approval is required by default.', {
  tableId, rowId, beforeRowId: z.number().int().positive().optional(), approvalId
}, async (a) => {
  assertTableAllowed(config, a.tableId);
  assertWriteApproval(config, 'baserow.row.move', `table:${a.tableId}:row:${a.rowId}`, a.approvalId);
  return out(await client.request('PATCH', `/api/database/rows/table/${a.tableId}/${a.rowId}/move/`, {
    query: { before_id: a.beforeRowId }, retryable: false
  }));
});

server.tool('baserow.row.delete', 'Permanently delete one row. DESTRUCTIVE. Disabled by default and always requires explicit approval.', {
  tableId, rowId, approvalId
}, async (a) => {
  assertTableAllowed(config, a.tableId);
  assertDeleteEnabled(config);
  assertApproval(config, 'baserow.row.delete', `table:${a.tableId}:row:${a.rowId}`, a.approvalId);
  await client.request('DELETE', `/api/database/rows/table/${a.tableId}/${a.rowId}/`, { retryable: false });
  return out({ deleted: true, tableId: a.tableId, rowId: a.rowId });
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
