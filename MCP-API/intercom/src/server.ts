import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { IntercomClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new IntercomClient(config);
const server = new McpServer({ name: 'intercom-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const Cursor = z.string().min(1).max(512).optional();
const Primitive = z.union([z.string().max(4000), z.number(), z.boolean(), z.null()]);

server.tool('intercom.admin.me', 'Get the authenticated Intercom admin identity. READ.', {},
  async () => json(await client.request('/me')));

server.tool('intercom.contact.search', 'Search contacts by one allowlisted field using Intercom contact search. READ.', {
  field: z.enum(['id', 'external_id', 'email', 'phone', 'name', 'role']),
  value: z.string().min(1).max(500),
  operator: z.enum(['=', '!=', '~']).default('='),
  per_page: z.number().int().min(1).max(150).default(50),
  starting_after: Cursor
}, async ({ field, value, operator, per_page, starting_after }) => json(await client.request('/contacts/search', {
  method: 'POST',
  body: {
    query: { field, operator, value },
    pagination: { per_page, ...(starting_after ? { starting_after } : {}) }
  }
})));

server.tool('intercom.contact.get', 'Get one contact by Intercom contact ID. READ.', { contact_id: Id },
  async ({ contact_id }) => json(await client.request(`/contacts/${encodeURIComponent(contact_id)}`)));

server.tool('intercom.contact.update', 'Update a bounded subset of contact profile fields. WRITE; operator approval required by default.', {
  contact_id: Id,
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(320).optional(),
  phone: z.string().min(3).max(64).nullable().optional(),
  external_id: z.string().min(1).max(255).optional(),
  custom_attributes: z.record(z.string().min(1).max(128), Primitive).optional()
}, async ({ contact_id, ...body }) => {
  if (Object.keys(body).length === 0) throw new Error('VALIDATION_ERROR: at least one contact field must be supplied');
  assertWriteAllowed(config, 'intercom.contact.update');
  return json(await client.request(`/contacts/${encodeURIComponent(contact_id)}`, { method: 'PUT', body }));
});

server.tool('intercom.conversation.list', 'List conversations with bounded cursor pagination. READ.', {
  per_page: z.number().int().min(1).max(150).default(50),
  starting_after: Cursor
}, async ({ per_page, starting_after }) => json(await client.request('/conversations', {
  query: { per_page, starting_after }
})));

server.tool('intercom.conversation.get', 'Get one conversation including its parts. READ.', { conversation_id: Id },
  async ({ conversation_id }) => json(await client.request(`/conversations/${encodeURIComponent(conversation_id)}`)));

server.tool('intercom.conversation.reply', 'Send an admin reply to a customer conversation. HIGH_RISK external message; explicit operator approval required.', {
  conversation_id: Id,
  admin_id: Id,
  body: z.string().min(1).max(10000)
}, async ({ conversation_id, admin_id, body }) => {
  assertWriteAllowed(config, 'intercom.conversation.reply');
  return json(await client.request(`/conversations/${encodeURIComponent(conversation_id)}/reply`, {
    method: 'POST', body: { message_type: 'comment', type: 'admin', admin_id, body }
  }));
});

server.tool('intercom.conversation.note.add', 'Add an internal admin note to a conversation. WRITE; operator approval required by default.', {
  conversation_id: Id,
  admin_id: Id,
  body: z.string().min(1).max(10000)
}, async ({ conversation_id, admin_id, body }) => {
  assertWriteAllowed(config, 'intercom.conversation.note.add');
  return json(await client.request(`/conversations/${encodeURIComponent(conversation_id)}/reply`, {
    method: 'POST', body: { message_type: 'note', type: 'admin', admin_id, body }
  }));
});

server.tool('intercom.conversation.assign', 'Assign a conversation to an Intercom admin or team. WRITE; operator approval required by default.', {
  conversation_id: Id,
  admin_id: Id,
  assignee_id: Id,
  assignee_type: z.enum(['admin', 'team']),
  body: z.string().max(4000).optional()
}, async ({ conversation_id, admin_id, assignee_id, assignee_type, body }) => {
  assertWriteAllowed(config, 'intercom.conversation.assign');
  return json(await client.request(`/conversations/${encodeURIComponent(conversation_id)}/parts`, {
    method: 'POST', body: { message_type: 'assignment', type: assignee_type, admin_id, assignee_id, ...(body ? { body } : {}) }
  }));
});

const ConversationActionSchema = {
  conversation_id: Id,
  admin_id: Id,
  body: z.string().max(4000).optional()
};

server.tool('intercom.conversation.close', 'Close a conversation. WRITE; explicit operator approval required.', ConversationActionSchema,
  async ({ conversation_id, admin_id, body }) => {
    assertWriteAllowed(config, 'intercom.conversation.close');
    return json(await client.request(`/conversations/${encodeURIComponent(conversation_id)}/parts`, {
      method: 'POST', body: { message_type: 'close', type: 'admin', admin_id, ...(body ? { body } : {}) }
    }));
  });

server.tool('intercom.conversation.reopen', 'Reopen a closed or snoozed conversation. WRITE; explicit operator approval required.', ConversationActionSchema,
  async ({ conversation_id, admin_id, body }) => {
    assertWriteAllowed(config, 'intercom.conversation.reopen');
    return json(await client.request(`/conversations/${encodeURIComponent(conversation_id)}/parts`, {
      method: 'POST', body: { message_type: 'open', type: 'admin', admin_id, ...(body ? { body } : {}) }
    }));
  });

server.tool('intercom.help_center.list', 'List Help Centers available to the workspace. READ.', {},
  async () => json(await client.request('/help_center/help_centers')));

server.tool('intercom.article.search', 'Search Help Center articles by phrase with bounded filters. READ.', {
  phrase: z.string().min(1).max(500),
  state: z.enum(['published', 'draft', 'all']).default('published'),
  help_center_id: z.number().int().positive().optional(),
  highlight: z.boolean().default(false)
}, async (args) => json(await client.request('/articles/search', { query: args })));

await server.connect(new StdioServerTransport());
