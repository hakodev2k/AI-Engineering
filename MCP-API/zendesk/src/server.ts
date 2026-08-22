import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ZendeskClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new ZendeskClient(config);
const server = new McpServer({ name: 'zendesk-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Id = z.number().int().positive();
const Page = z.number().int().min(1).max(1000).default(1);
const PerPage = z.number().int().min(1).max(100).default(50);

server.tool('zendesk.ticket.list','List tickets. READ.',{page:Page,per_page:PerPage}, async a=>json(await client.request('/tickets.json',{query:a})));
server.tool('zendesk.ticket.search','Search tickets using Zendesk search syntax. READ.',{query:z.string().min(1).max(2000),page:Page,per_page:PerPage}, async a=>json(await client.request('/search.json',{query:a})));
server.tool('zendesk.ticket.get','Get one ticket. READ.',{ticket_id:Id}, async ({ticket_id})=>json(await client.request(`/tickets/${ticket_id}.json`)));
server.tool('zendesk.ticket.create','Create a support ticket. WRITE; approval required by default.',{
  subject:z.string().min(1).max(150),
  comment:z.string().min(1).max(10000),
  priority:z.enum(['low','normal','high','urgent']).optional(),
  type:z.enum(['problem','incident','question','task']).optional(),
  requester_id:Id.optional(),
  assignee_id:Id.optional(),
  group_id:Id.optional(),
  tags:z.array(z.string().min(1).max(100)).max(100).optional()
}, async a=>{ assertWriteAllowed(config,'zendesk.ticket.create'); const {comment,...ticket}=a; return json(await client.request('/tickets.json',{method:'POST',body:{ticket:{...ticket,comment:{body:comment,public:true}}}})); });
server.tool('zendesk.ticket.update','Update selected ticket fields. WRITE; approval required by default.',{
  ticket_id:Id,
  status:z.enum(['new','open','pending','hold','solved','closed']).optional(),
  priority:z.enum(['low','normal','high','urgent']).optional(),
  assignee_id:Id.optional(),
  group_id:Id.optional(),
  tags:z.array(z.string().min(1).max(100)).max(100).optional()
}, async ({ticket_id,...ticket})=>{ assertWriteAllowed(config,'zendesk.ticket.update'); if(Object.values(ticket).every(v=>v===undefined)) throw new Error('VALIDATION_ERROR: at least one field is required'); return json(await client.request(`/tickets/${ticket_id}.json`,{method:'PUT',body:{ticket}})); });
server.tool('zendesk.ticket.comment.add','Add a public or internal comment to a ticket. WRITE; approval required by default.',{
  ticket_id:Id,
  body:z.string().min(1).max(10000),
  public:z.boolean().default(false)
}, async ({ticket_id,body,public:pub})=>{ assertWriteAllowed(config,'zendesk.ticket.comment.add'); return json(await client.request(`/tickets/${ticket_id}.json`,{method:'PUT',body:{ticket:{comment:{body,public:pub}}}})); });
server.tool('zendesk.ticket.delete','Delete a ticket. DESTRUCTIVE; explicit approval and destructive enablement required.',{ticket_id:Id}, async ({ticket_id})=>{ assertWriteAllowed(config,'zendesk.ticket.delete',true); return json(await client.request(`/tickets/${ticket_id}.json`,{method:'DELETE'})); });
server.tool('zendesk.user.list','List users. READ.',{page:Page,per_page:PerPage}, async a=>json(await client.request('/users.json',{query:a})));
server.tool('zendesk.user.search','Search users by query. READ.',{query:z.string().min(1).max(500)}, async a=>json(await client.request('/users/search.json',{query:a})));
server.tool('zendesk.user.get','Get one user. READ.',{user_id:Id}, async ({user_id})=>json(await client.request(`/users/${user_id}.json`)));
server.tool('zendesk.organization.list','List organizations. READ.',{page:Page,per_page:PerPage}, async a=>json(await client.request('/organizations.json',{query:a})));
server.tool('zendesk.organization.get','Get one organization. READ.',{organization_id:Id}, async ({organization_id})=>json(await client.request(`/organizations/${organization_id}.json`)));
server.tool('zendesk.group.list','List groups visible to the caller. READ.',{page:Page,per_page:PerPage}, async a=>json(await client.request('/groups.json',{query:a})));

await server.connect(new StdioServerTransport());
