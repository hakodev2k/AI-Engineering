import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { Auth0Client } from './client.js';
import { assertApproval, TOOL_POLICY } from './policy.js';

const cfg = loadConfig();
const client = new Auth0Client(cfg);
const server = new McpServer({ name: 'auth0-connector', version: '1.0.0' });
const text = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] });
const safeId = z.string().min(1).max(256).regex(/^[A-Za-z0-9_|-]+$/);
const approval = z.string().min(64).max(128).optional();

server.tool('auth0.user.search', 'Search Auth0 users. READ. Requires read:users.', { q: z.string().min(1).max(1024), page: z.number().int().min(0).max(1000).default(0), perPage: z.number().int().min(1).max(100).default(25) }, async ({ q, page, perPage }) => text(await client.request('GET', `/api/v2/users?q=${encodeURIComponent(q)}&search_engine=v3&page=${page}&per_page=${perPage}`)));
server.tool('auth0.user.get', 'Get an Auth0 user by ID. READ. Requires read:users.', { userId: safeId }, async ({ userId }) => text(await client.request('GET', `/api/v2/users/${encodeURIComponent(userId)}`)));
server.tool('auth0.user.create', 'Create an Auth0 database/passwordless user. WRITE; explicit approval required. Requires create:users.', { connection: z.string().min(1).max(128), email: z.string().email().optional(), username: z.string().min(1).max(128).optional(), password: z.string().min(8).max(256).optional(), emailVerified: z.boolean().optional(), approvalId: approval }, async (args) => { const { approvalId, emailVerified, ...body0 } = args; if (!body0.email && !body0.username) throw new Error('email or username is required'); const body = { ...body0, email_verified: emailVerified }; assertApproval('auth0.user.create', body, approvalId, cfg.approvalSecret); return text(await client.request('POST', '/api/v2/users', body)); });
server.tool('auth0.user.update', 'Update selected Auth0 user attributes. WRITE; explicit approval required. Requires update:users.', { userId: safeId, email: z.string().email().optional(), name: z.string().max(256).optional(), nickname: z.string().max(256).optional(), blocked: z.boolean().optional(), appMetadata: z.record(z.unknown()).optional(), userMetadata: z.record(z.unknown()).optional(), approvalId: approval }, async (args) => { const { userId, approvalId, appMetadata, userMetadata, ...rest } = args; const body = { ...rest, app_metadata: appMetadata, user_metadata: userMetadata }; if (!Object.values(body).some(v => v !== undefined)) throw new Error('At least one mutable field is required'); assertApproval('auth0.user.update', { userId, body }, approvalId, cfg.approvalSecret); return text(await client.request('PATCH', `/api/v2/users/${encodeURIComponent(userId)}`, body)); });
server.tool('auth0.user.delete', 'Delete an Auth0 user. DESTRUCTIVE; explicit approval required. Requires delete:users.', { userId: safeId, approvalId: approval }, async ({ userId, approvalId }) => { assertApproval('auth0.user.delete', { userId }, approvalId, cfg.approvalSecret); await client.request('DELETE', `/api/v2/users/${encodeURIComponent(userId)}`); return text({ deleted: true, userId }); });
server.tool('auth0.client.list', 'List Auth0 applications/clients. READ. Requires read:clients.', { page: z.number().int().min(0).max(1000).default(0), perPage: z.number().int().min(1).max(100).default(25) }, async ({ page, perPage }) => text(await client.request('GET', `/api/v2/clients?page=${page}&per_page=${perPage}&include_totals=true&fields=client_id,name,app_type,is_first_party,callbacks,allowed_logout_urls&include_fields=true`)));
server.tool('auth0.connection.list', 'List Auth0 identity connections. READ. Requires read:connections.', { page: z.number().int().min(0).max(1000).default(0), perPage: z.number().int().min(1).max(100).default(25) }, async ({ page, perPage }) => text(await client.request('GET', `/api/v2/connections?page=${page}&per_page=${perPage}`)));
server.tool('auth0.role.list', 'List Auth0 roles. READ. Requires read:roles.', { page: z.number().int().min(0).max(1000).default(0), perPage: z.number().int().min(1).max(100).default(25) }, async ({ page, perPage }) => text(await client.request('GET', `/api/v2/roles?page=${page}&per_page=${perPage}&include_totals=true`)));
server.tool('auth0.log.list', 'List tenant logs for auditing/troubleshooting. READ. Requires read:logs.', { take: z.number().int().min(1).max(100).default(25), from: z.string().max(128).optional(), q: z.string().max(1024).optional() }, async ({ take, from, q }) => { const p = new URLSearchParams({ take: String(take) }); if (from) p.set('from', from); if (q) p.set('q', q); return text(await client.request('GET', `/api/v2/logs?${p.toString()}`)); });

export { server, TOOL_POLICY };
if (process.env.NODE_ENV !== 'test') await server.connect(new StdioServerTransport());
