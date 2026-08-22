import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { TrelloClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new TrelloClient(config);
const server = new McpServer({ name: 'trello-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);

server.tool('trello.member.get', 'Get the authenticated Trello member. READ.', {},
  async () => json(await client.request('/members/me', { query: { fields: 'id,username,fullName' } })));

server.tool('trello.board.list', 'List boards visible to the authenticated member. READ.', {
  filter: z.enum(['all', 'open', 'closed', 'members', 'organization', 'public', 'starred']).default('open'),
  fields: z.string().max(500).default('id,name,desc,closed,url,idOrganization')
}, async ({ filter, fields }) => json(await client.request('/members/me/boards', { query: { filter, fields } })));

server.tool('trello.board.get', 'Get one board. READ.', { board_id: Id },
  async ({ board_id }) => json(await client.request(`/boards/${board_id}`, { query: { fields: 'id,name,desc,closed,url,idOrganization' } })));

server.tool('trello.board.create', 'Create a board. WRITE; approval required by default.', {
  name: z.string().min(1).max(16384),
  desc: z.string().max(16384).optional(),
  default_lists: z.boolean().default(true),
  id_organization: Id.optional()
}, async ({ name, desc, default_lists, id_organization }) => {
  assertWriteAllowed(config, 'trello.board.create');
  return json(await client.request('/boards', { method: 'POST', query: { name, desc, defaultLists: default_lists, idOrganization: id_organization } }));
});

server.tool('trello.list.list', 'List lists on a board. READ.', { board_id: Id, filter: z.enum(['all', 'open', 'closed']).default('open') },
  async ({ board_id, filter }) => json(await client.request(`/boards/${board_id}/lists`, { query: { filter } })));

server.tool('trello.list.create', 'Create a list on a board. WRITE; approval required by default.', {
  board_id: Id, name: z.string().min(1).max(16384), pos: z.union([z.enum(['top', 'bottom']), z.number().nonnegative()]).default('bottom')
}, async ({ board_id, name, pos }) => {
  assertWriteAllowed(config, 'trello.list.create');
  return json(await client.request('/lists', { method: 'POST', query: { idBoard: board_id, name, pos } }));
});

server.tool('trello.card.search', 'Search cards and boards visible to the token. READ.', {
  query: z.string().min(1).max(1000),
  model_types: z.enum(['cards', 'boards', 'cards,boards']).default('cards'),
  cards_limit: z.number().int().min(1).max(100).default(20)
}, async ({ query, model_types, cards_limit }) => json(await client.request('/search', { query: { query, modelTypes: model_types, cards_limit } })));

server.tool('trello.card.get', 'Get one card. READ.', { card_id: Id },
  async ({ card_id }) => json(await client.request(`/cards/${card_id}`, { query: { fields: 'id,name,desc,closed,due,dueComplete,idBoard,idList,url' } })));

server.tool('trello.card.create', 'Create a card in a list. WRITE; approval required by default.', {
  list_id: Id,
  name: z.string().min(1).max(16384),
  desc: z.string().max(16384).optional(),
  due: z.string().datetime().optional(),
  pos: z.union([z.enum(['top', 'bottom']), z.number().nonnegative()]).default('bottom')
}, async ({ list_id, name, desc, due, pos }) => {
  assertWriteAllowed(config, 'trello.card.create');
  return json(await client.request('/cards', { method: 'POST', query: { idList: list_id, name, desc, due, pos } }));
});

server.tool('trello.card.update', 'Update selected card fields. WRITE; approval required by default.', {
  card_id: Id,
  name: z.string().min(1).max(16384).optional(),
  desc: z.string().max(16384).optional(),
  due: z.string().datetime().nullable().optional(),
  due_complete: z.boolean().optional()
}, async ({ card_id, name, desc, due, due_complete }) => {
  assertWriteAllowed(config, 'trello.card.update');
  return json(await client.request(`/cards/${card_id}`, { method: 'PUT', query: { name, desc, due: due === null ? '' : due, dueComplete: due_complete } }));
});

server.tool('trello.card.move', 'Move a card to another list. WRITE; approval required by default.', { card_id: Id, list_id: Id },
  async ({ card_id, list_id }) => { assertWriteAllowed(config, 'trello.card.move'); return json(await client.request(`/cards/${card_id}`, { method: 'PUT', query: { idList: list_id } })); });

server.tool('trello.card.comment', 'Post a comment as the authenticated member. WRITE external communication; explicit approval required.', {
  card_id: Id, text: z.string().min(1).max(16384)
}, async ({ card_id, text }) => { assertWriteAllowed(config, 'trello.card.comment'); return json(await client.request(`/cards/${card_id}/actions/comments`, { method: 'POST', query: { text } })); });

server.tool('trello.card.archive', 'Archive a card. HIGH_RISK reversible mutation; disabled by default and requires approval.', { card_id: Id },
  async ({ card_id }) => { assertWriteAllowed(config, 'trello.card.archive', true); return json(await client.request(`/cards/${card_id}`, { method: 'PUT', query: { closed: true } })); });

server.tool('trello.webhook.create', 'Create a webhook for a model. WRITE; approval required. callback_url must be HTTPS.', {
  callback_url: z.string().url().refine(v => v.startsWith('https://'), 'callback_url must use HTTPS'),
  model_id: Id,
  description: z.string().max(16384).optional()
}, async ({ callback_url, model_id, description }) => {
  assertWriteAllowed(config, 'trello.webhook.create');
  return json(await client.request('/webhooks', { method: 'POST', query: { callbackURL: callback_url, idModel: model_id, description } }));
});

await server.connect(new StdioServerTransport());
