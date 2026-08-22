import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { FreshdeskClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new FreshdeskClient(config);
const server = new McpServer({ name: 'freshdesk-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Id = z.number().int().positive();
const Page = z.number().int().min(1).max(500).default(1);
const PerPage = z.number().int().min(1).max(100).default(30);
const Status = z.number().int().refine(v => [2, 3, 4, 5].includes(v), 'status must be 2, 3, 4, or 5');
const Priority = z.number().int().refine(v => [1, 2, 3, 4].includes(v), 'priority must be 1, 2, 3, or 4');

server.tool('freshdesk.account.get', 'Get Freshdesk account metadata. READ.', {},
  async () => json(await client.request('/account')));

server.tool('freshdesk.ticket.list', 'List tickets with bounded pagination. READ.', {
  page: Page,
  per_page: PerPage,
  order_by: z.enum(['created_at', 'updated_at', 'priority', 'status']).optional(),
  order_type: z.enum(['asc', 'desc']).optional(),
  updated_since: z.string().datetime().optional()
}, async (args) => json(await client.request('/tickets', { query: args })));

server.tool('freshdesk.ticket.get', 'Get one ticket. READ.', { ticket_id: Id },
  async ({ ticket_id }) => json(await client.request(`/tickets/${ticket_id}`)));

server.tool('freshdesk.ticket.search', 'Search tickets using Freshdesk search query syntax. READ.', {
  query: z.string().min(3).max(512),
  page: Page
}, async ({ query, page }) => json(await client.request('/search/tickets', { query: { query, page } })));

server.tool('freshdesk.ticket.create', 'Create a support ticket. WRITE; operator approval required by default.', {
  email: z.string().email(),
  subject: z.string().min(1).max(255),
  description: z.string().min(1).max(20000),
  status: Status,
  priority: Priority,
  type: z.string().min(1).max(100).optional(),
  group_id: Id.optional(),
  responder_id: Id.optional(),
  tags: z.array(z.string().min(1).max(100)).max(50).optional()
}, async (body) => {
  assertWriteAllowed(config, 'freshdesk.ticket.create');
  return json(await client.request('/tickets', { method: 'POST', body }));
});

server.tool('freshdesk.ticket.update', 'Update supported fields on a ticket. WRITE; operator approval required by default.', {
  ticket_id: Id,
  subject: z.string().min(1).max(255).optional(),
  status: Status.optional(),
  priority: Priority.optional(),
  type: z.string().min(1).max(100).optional(),
  group_id: Id.optional(),
  responder_id: Id.optional(),
  tags: z.array(z.string().min(1).max(100)).max(50).optional()
}, async ({ ticket_id, ...body }) => {
  if (Object.keys(body).length === 0) throw new Error('VALIDATION_ERROR: at least one field must be supplied');
  assertWriteAllowed(config, 'freshdesk.ticket.update');
  return json(await client.request(`/tickets/${ticket_id}`, { method: 'PUT', body }));
});

server.tool('freshdesk.conversation.list', 'List all conversations for a ticket. READ.', { ticket_id: Id },
  async ({ ticket_id }) => json(await client.request(`/tickets/${ticket_id}/conversations`)));

server.tool('freshdesk.ticket.reply', 'Send a reply to the requester. HIGH_RISK external communication; explicit operator approval required.', {
  ticket_id: Id,
  body: z.string().min(1).max(20000),
  cc_emails: z.array(z.string().email()).max(20).optional(),
  bcc_emails: z.array(z.string().email()).max(20).optional()
}, async ({ ticket_id, ...body }) => {
  assertWriteAllowed(config, 'freshdesk.ticket.reply');
  return json(await client.request(`/tickets/${ticket_id}/reply`, { method: 'POST', body }));
});

server.tool('freshdesk.ticket.note.create', 'Create a private or public note on a ticket. WRITE; operator approval required.', {
  ticket_id: Id,
  body: z.string().min(1).max(20000),
  private: z.boolean().default(true),
  notify_emails: z.array(z.string().email()).max(20).optional()
}, async ({ ticket_id, ...body }) => {
  assertWriteAllowed(config, 'freshdesk.ticket.note.create');
  return json(await client.request(`/tickets/${ticket_id}/notes`, { method: 'POST', body }));
});

server.tool('freshdesk.contact.list', 'List contacts with bounded pagination. READ.', {
  page: Page,
  per_page: PerPage
}, async (args) => json(await client.request('/contacts', { query: args })));

server.tool('freshdesk.contact.get', 'Get one contact. READ.', { contact_id: Id },
  async ({ contact_id }) => json(await client.request(`/contacts/${contact_id}`)));

server.tool('freshdesk.contact.search', 'Search contacts by name, email, or phone using autocomplete. READ.', {
  term: z.string().min(2).max(128)
}, async ({ term }) => json(await client.request('/contacts/autocomplete', { query: { term } })));

server.tool('freshdesk.contact.create', 'Create a contact. WRITE; operator approval required by default.', {
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().min(3).max(50).optional(),
  mobile: z.string().min(3).max(50).optional(),
  description: z.string().max(5000).optional(),
  job_title: z.string().max(255).optional()
}, async (body) => {
  assertWriteAllowed(config, 'freshdesk.contact.create');
  return json(await client.request('/contacts', { method: 'POST', body }));
});

server.tool('freshdesk.contact.update', 'Update supported contact fields. WRITE; operator approval required by default.', {
  contact_id: Id,
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).max(50).optional(),
  mobile: z.string().min(3).max(50).optional(),
  description: z.string().max(5000).optional(),
  job_title: z.string().max(255).optional()
}, async ({ contact_id, ...body }) => {
  if (Object.keys(body).length === 0) throw new Error('VALIDATION_ERROR: at least one field must be supplied');
  assertWriteAllowed(config, 'freshdesk.contact.update');
  return json(await client.request(`/contacts/${contact_id}`, { method: 'PUT', body }));
});

server.tool('freshdesk.agent.list', 'List agents visible to the configured API-key principal. READ.', {
  page: Page,
  per_page: PerPage
}, async (args) => json(await client.request('/agents', { query: args })));

server.tool('freshdesk.group.list', 'List support groups. READ.', {},
  async () => json(await client.request('/groups')));

await server.connect(new StdioServerTransport());
