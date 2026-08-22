import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertWriteAllowed, loadConfig } from './config.js';
import { MondayMcpClient } from './mcp-client.js';
import { MondayGraphqlClient } from './graphql-client.js';

const config = loadConfig();
const upstream = new MondayMcpClient(config);
const graphql = new MondayGraphqlClient(config);
const server = new McpServer({ name: 'monday-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Id = z.union([z.string().regex(/^\d+$/), z.number().int().positive()]).transform(String);
const Cursor = z.string().min(1).max(2000).optional();

server.tool('monday.connection.validate', 'Validate the official monday Platform MCP connection and required allowlisted upstream tools. READ.', {},
  async () => { await upstream.verifyAllowlist(); return json({ ok: true }); });

server.tool('monday.user.context.get', 'Get current monday user/account context through the official Platform MCP. READ.', {},
  async () => json(await upstream.call('get_user_context', {})));

server.tool('monday.workspace.list', 'List workspaces visible to the authenticated monday user through the official Platform MCP. READ.', {
  limit: z.number().int().min(1).max(100).default(50)
}, async ({ limit }) => json(await upstream.call('list_workspaces', { limit })));

server.tool('monday.board.get', 'Get board metadata, columns, groups, views, owners, and workspace through the official Platform MCP. READ.', {
  board_id: Id
}, async ({ board_id }) => json(await upstream.call('get_board_info', { boardId: Number(board_id) })));

server.tool('monday.board.items.list', 'List a bounded page of board items through the official Platform MCP. READ.', {
  board_id: Id,
  limit: z.number().int().min(1).max(100).default(25),
  cursor: Cursor,
  include_columns: z.boolean().default(true),
  include_subitems: z.boolean().default(false)
}, async ({ board_id, limit, cursor, include_columns, include_subitems }) => json(await upstream.call('get_board_items_page', {
  boardId: Number(board_id), limit, cursor, includeColumns: include_columns, includeSubItems: include_subitems
})));

server.tool('monday.item.create', 'Create an item through the official Platform MCP. WRITE; explicit operator approval is required by default.', {
  board_id: Id,
  name: z.string().min(1).max(500),
  column_values: z.record(z.string().min(1).max(128), z.unknown()).default({}),
  group_id: z.string().min(1).max(128).optional()
}, async ({ board_id, name, column_values, group_id }) => {
  assertWriteAllowed(config, 'monday.item.create');
  return json(await upstream.call('create_item', {
    boardId: Number(board_id), name, columnValues: JSON.stringify(column_values), groupId: group_id
  }));
});

server.tool('monday.item.columns.update', 'Update one or more item column values through the official Platform MCP. WRITE; explicit operator approval is required by default.', {
  board_id: Id,
  item_id: Id,
  column_values: z.record(z.string().min(1).max(128), z.unknown()).refine(value => Object.keys(value).length > 0, 'at least one column value is required'),
  create_labels_if_missing: z.boolean().default(false)
}, async ({ board_id, item_id, column_values, create_labels_if_missing }) => {
  assertWriteAllowed(config, 'monday.item.columns.update');
  return json(await upstream.call('change_item_column_values', {
    boardId: Number(board_id), itemId: Number(item_id), columnValues: JSON.stringify(column_values), createLabelsIfMissing: create_labels_if_missing
  }));
});

server.tool('monday.update.list', 'Read item or board updates through the official Platform MCP. READ.', {
  object_id: Id,
  object_type: z.enum(['Item', 'Board']),
  limit: z.number().int().min(1).max(100).default(25),
  page: z.number().int().min(1).max(10000).default(1)
}, async ({ object_id, object_type, limit, page }) => json(await upstream.call('get_updates', {
  objectId: object_id, objectType: object_type, limit, page
})));

server.tool('monday.update.create', 'Post a visible update/comment on an item through the official Platform MCP. WRITE/external communication; explicit human approval is required.', {
  item_id: Id,
  body_html: z.string().min(1).max(10000),
  parent_update_id: Id.optional()
}, async ({ item_id, body_html, parent_update_id }) => {
  assertWriteAllowed(config, 'monday.update.create');
  return json(await upstream.call('create_update', {
    itemId: Number(item_id), body: body_html, parentId: parent_update_id ? Number(parent_update_id) : undefined
  }));
});

server.tool('monday.webhook.list', 'List webhooks for one board through the official GraphQL API fallback. READ; requires webhooks:read for app tokens.', {
  board_id: Id,
  app_webhooks_only: z.boolean().default(true)
}, async ({ board_id, app_webhooks_only }) => {
  const data = await graphql.execute<{ webhooks: unknown[] }>(
    'query Webhooks($boardId: ID!, $appOnly: Boolean!) { webhooks(board_id: $boardId, app_webhooks_only: $appOnly) { id event board_id config } }',
    { boardId: board_id, appOnly: app_webhooks_only }
  );
  return json(data.webhooks);
});

const WebhookEvent = z.enum(['change_column_value', 'create_item', 'create_update', 'delete_item']);

server.tool('monday.webhook.create', 'Create a board webhook through the official GraphQL API fallback. WRITE/external callback; explicit human approval is required.', {
  board_id: Id,
  callback_url: z.string().url().refine(value => new URL(value).protocol === 'https:', 'callback_url must use HTTPS'),
  event: WebhookEvent
}, async ({ board_id, callback_url, event }) => {
  assertWriteAllowed(config, 'monday.webhook.create');
  const data = await graphql.execute<{ create_webhook: unknown }>(
    'mutation CreateWebhook($boardId: ID!, $url: String!, $event: WebhookEventType!) { create_webhook(board_id: $boardId, url: $url, event: $event) { id board_id event } }',
    { boardId: board_id, url: callback_url, event }, true
  );
  return json(data.create_webhook);
});

server.tool('monday.webhook.delete', 'Delete a monday webhook through the official GraphQL API fallback. DESTRUCTIVE; strong approval and destructive enablement are required.', {
  webhook_id: Id
}, async ({ webhook_id }) => {
  assertWriteAllowed(config, 'monday.webhook.delete', true);
  const data = await graphql.execute<{ delete_webhook: unknown }>(
    'mutation DeleteWebhook($id: ID!) { delete_webhook(id: $id) { id } }',
    { id: webhook_id }, true
  );
  return json(data.delete_webhook);
});

const shutdown = async () => { await upstream.close(); process.exit(0); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
