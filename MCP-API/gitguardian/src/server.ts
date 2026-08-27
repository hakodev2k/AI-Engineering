import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { GitGuardianClient } from './client.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new GitGuardianClient(config);
const server = new McpServer({ name: 'gitguardian-connector', version: '1.0.0' });
const result = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] });
const id = z.number().int().positive();
const page = { cursor: z.string().max(1000).optional(), per_page: z.number().int().min(1).max(100).default(20) };

server.tool('gitguardian.incident.list', 'List internal secret incidents. READ; requires incidents:read.', {
  ...page,
  status: z.enum(['IGNORED','TRIGGERED','ASSIGNED','RESOLVED']).optional(),
  severity: z.enum(['critical','high','medium','low','info','unknown']).optional(),
  validity: z.enum(['valid','invalid','failed_to_check','no_checker','unknown']).optional(),
  ordering: z.enum(['date','-date','resolved_at','-resolved_at','ignored_at','-ignored_at','risk_score','-risk_score']).optional()
}, async (args) => result(await client.request('GET', '/incidents/secrets', { query: args })));

server.tool('gitguardian.incident.get', 'Get one internal secret incident. READ; requires incidents:read.', { incident_id: id },
  async ({ incident_id }) => result(await client.request('GET', `/incidents/secrets/${incident_id}`)));

server.tool('gitguardian.incident.locations.list', 'List current VCS locations for an incident. READ; requires incidents:read.', { incident_id: id, ...page },
  async ({ incident_id, ...query }) => result(await client.request('GET', `/incidents/secrets/${incident_id}/locations`, { query })));

server.tool('gitguardian.incident.notes.list', 'List notes on an incident. READ; requires incidents:read.', { incident_id: id, ...page, ordering: z.enum(['created_at','-created_at','updated_at','-updated_at']).optional() },
  async ({ incident_id, ...query }) => result(await client.request('GET', `/incidents/secrets/${incident_id}/notes`, { query })));

server.tool('gitguardian.source.list', 'List monitored sources. READ; requires sources:read.', { ...page, search: z.string().max(200).optional() },
  async (query) => result(await client.request('GET', '/sources', { query })));

server.tool('gitguardian.source.get', 'Get one source. READ; requires sources:read.', { source_id: id },
  async ({ source_id }) => result(await client.request('GET', `/sources/${source_id}`)));

server.tool('gitguardian.team.list', 'List workspace teams. READ; requires teams:read.', { ...page, search: z.string().max(200).optional(), is_global: z.boolean().optional() },
  async (query) => result(await client.request('GET', '/teams', { query })));

server.tool('gitguardian.content.scan', 'Scan supplied text for secrets without creating incidents. READ-like security analysis; requires scan scope. Never logs content.', {
  documents: z.array(z.object({ document: z.string().min(1).max(1_000_000), filename: z.string().max(500).optional() }).strict()).min(1).max(20)
}, async ({ documents }) => result(await client.request('POST', '/scan', { body: documents, retryable: false })));

server.tool('gitguardian.incident.note.create', 'Add a note to an incident. WRITE; requires incidents:write and explicit approval.', {
  incident_id: id, comment: z.string().min(1).max(10000), approval_id: z.string().min(32).max(256)
}, async ({ incident_id, comment, approval_id }) => {
  assertApproval(config, 'gitguardian.incident.note.create', String(incident_id), approval_id);
  return result(await client.request('POST', `/incidents/secrets/${incident_id}/notes`, { body: { comment }, retryable: false }));
});

server.tool('gitguardian.incident.assign', 'Assign an incident to exactly one workspace member. WRITE; requires incidents:write and explicit approval.', {
  incident_id: id,
  email: z.string().email().optional(),
  member_id: id.optional(),
  send_email: z.boolean().default(true),
  approval_id: z.string().min(32).max(256)
}, async ({ incident_id, email, member_id, send_email, approval_id }) => {
  if ((email ? 1 : 0) + (member_id ? 1 : 0) !== 1) throw new Error('Provide exactly one of email or member_id');
  assertApproval(config, 'gitguardian.incident.assign', String(incident_id), approval_id);
  return result(await client.request('POST', `/incidents/secrets/${incident_id}/assign`, { query: { send_email }, body: email ? { email } : { member_id }, retryable: false }));
});

await server.connect(new StdioServerTransport());
