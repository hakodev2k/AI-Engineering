import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { assertWriteApproved } from './policy.js';
import { HookdeckUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new HookdeckUpstream(config);
export const server = new McpServer({ name: 'hookdeck-mcp-connector', version: '1.0.0' });

const id = z.string().min(1).max(256);
const cursor = z.string().min(1).max(2048).optional();
const limit = z.number().int().min(1).max(100).optional();
const approvalId = z.string().regex(/^[a-f0-9]{64}$/i).optional();
const output = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const clean = (value: Record<string, unknown>) => Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined));

server.tool('hookdeck.project.list', 'READ: list Hookdeck projects visible to the configured identity.', {}, async () => output(await upstream.call('hookdeck_projects', { action: 'list' })));
server.tool('hookdeck.project.use', 'READ/context: switch the official Hookdeck MCP subprocess to a project before project-scoped reads.', { projectId: id }, async ({ projectId }) => output(await upstream.call('hookdeck_projects', { action: 'use', project_id: projectId })));

const connectionListSchema = { name: z.string().max(256).optional(), sourceId: id.optional(), destinationId: id.optional(), disabled: z.boolean().optional(), limit, next: cursor, prev: cursor };
server.tool('hookdeck.connection.list', 'READ: list connections with bounded filters and pagination.', connectionListSchema, async (a) => output(await upstream.call('hookdeck_connections', clean({ action: 'list', name: a.name, source_id: a.sourceId, destination_id: a.destinationId, disabled: a.disabled, limit: a.limit, next: a.next, prev: a.prev }))));
server.tool('hookdeck.connection.get', 'READ: get one connection by ID or name.', { id }, async ({ id }) => output(await upstream.call('hookdeck_connections', { action: 'get', id })));
server.tool('hookdeck.connection.pause', 'WRITE: pause a connection delivery pipeline. Requires explicit payload-bound human approval.', { id, approvalId }, async ({ id, approvalId }) => { const args = { id }; assertWriteApproved(config, 'hookdeck.connection.pause', args, approvalId); return output(await upstream.call('hookdeck_connections', { action: 'pause', id })); });
server.tool('hookdeck.connection.unpause', 'WRITE: unpause a connection delivery pipeline. Requires explicit payload-bound human approval.', { id, approvalId }, async ({ id, approvalId }) => { const args = { id }; assertWriteApproved(config, 'hookdeck.connection.unpause', args, approvalId); return output(await upstream.call('hookdeck_connections', { action: 'unpause', id })); });

const simpleListSchema = { name: z.string().max(256).optional(), limit, next: cursor, prev: cursor };
server.tool('hookdeck.source.list', 'READ: list inbound sources.', simpleListSchema, async (a) => output(await upstream.call('hookdeck_sources', clean({ action: 'list', ...a }))));
server.tool('hookdeck.source.get', 'READ: get an inbound source by ID.', { id }, async ({ id }) => output(await upstream.call('hookdeck_sources', { action: 'get', id })));
server.tool('hookdeck.destination.list', 'READ: list delivery destinations.', simpleListSchema, async (a) => output(await upstream.call('hookdeck_destinations', clean({ action: 'list', ...a }))));
server.tool('hookdeck.destination.get', 'READ: get a delivery destination by ID.', { id }, async ({ id }) => output(await upstream.call('hookdeck_destinations', { action: 'get', id })));
server.tool('hookdeck.transformation.list', 'READ: list JavaScript transformations.', simpleListSchema, async (a) => output(await upstream.call('hookdeck_transformations', clean({ action: 'list', ...a }))));
server.tool('hookdeck.transformation.get', 'READ: get a transformation by ID.', { id }, async ({ id }) => output(await upstream.call('hookdeck_transformations', { action: 'get', id })));

const eventListSchema = { connectionId: id.optional(), sourceId: id.optional(), destinationId: id.optional(), status: z.enum(['SCHEDULED','QUEUED','HOLD','SUCCESSFUL','FAILED','CANCELLED']).optional(), issueId: id.optional(), errorCode: z.string().max(128).optional(), responseStatus: z.string().max(64).optional(), createdAfter: z.string().max(64).optional(), createdBefore: z.string().max(64).optional(), limit, next: cursor, prev: cursor };
server.tool('hookdeck.event.list', 'READ: list processed events with scoped operational filters.', eventListSchema, async (a) => output(await upstream.call('hookdeck_events', clean({ action: 'list', connection_id: a.connectionId, source_id: a.sourceId, destination_id: a.destinationId, status: a.status, issue_id: a.issueId, error_code: a.errorCode, response_status: a.responseStatus, created_after: a.createdAfter, created_before: a.createdBefore, limit: a.limit, next: a.next, prev: a.prev }))));
server.tool('hookdeck.event.get', 'READ: get event metadata by ID.', { id }, async ({ id }) => output(await upstream.call('hookdeck_events', { action: 'get', id })));

const requestListSchema = { sourceId: id.optional(), status: z.enum(['accepted','rejected']).optional(), verified: z.boolean().optional(), createdAfter: z.string().max(64).optional(), createdBefore: z.string().max(64).optional(), limit, next: cursor, prev: cursor };
server.tool('hookdeck.request.list', 'READ: list inbound requests with bounded filters.', requestListSchema, async (a) => output(await upstream.call('hookdeck_requests', clean({ action: 'list', source_id: a.sourceId, status: a.status, verified: a.verified, created_after: a.createdAfter, created_before: a.createdBefore, limit: a.limit, next: a.next, prev: a.prev }))));
server.tool('hookdeck.request.get', 'READ: get inbound request metadata by ID.', { id }, async ({ id }) => output(await upstream.call('hookdeck_requests', { action: 'get', id })));
server.tool('hookdeck.attempt.list', 'READ: list delivery attempts, optionally scoped to one event.', { eventId: id.optional(), limit, next: cursor, prev: cursor }, async (a) => output(await upstream.call('hookdeck_attempts', clean({ action: 'list', event_id: a.eventId, limit: a.limit, next: a.next, prev: a.prev }))));
server.tool('hookdeck.attempt.get', 'READ: get one delivery attempt by ID.', { id }, async ({ id }) => output(await upstream.call('hookdeck_attempts', { action: 'get', id })));

const shutdown = () => { void upstream.close().finally(() => server.close().then(() => process.exit(0), () => process.exit(1))); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

if (process.env.NODE_ENV !== 'test') await server.connect(new StdioServerTransport());
