import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { UptimeRobotClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new UptimeRobotClient(config);
const server = new McpServer({ name: 'uptimerobot-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Id = z.union([z.number().int().positive(), z.string().min(1).max(128)]);
const Cursor = z.string().min(1).max(1000).optional();
const Limit = z.number().int().min(1).max(100).default(50);

server.tool('uptimerobot.monitor.list', 'List monitors with bounded cursor pagination. READ.', {
  limit: Limit,
  cursor: Cursor
}, async ({ limit, cursor }) => json(await client.request('/monitors', { query: { limit, cursor } })));

server.tool('uptimerobot.monitor.get', 'Get one monitor by ID. READ.', { monitor_id: Id },
  async ({ monitor_id }) => json(await client.request(`/monitors/${encodeURIComponent(String(monitor_id))}`)));

const MonitorCreate = {
  friendlyName: z.string().min(1).max(255),
  url: z.string().url().max(2048),
  type: z.enum(['HTTP', 'KEYWORD', 'PING', 'PORT', 'HEARTBEAT']).default('HTTP'),
  interval: z.number().int().min(60).max(86400).optional(),
  timeout: z.number().int().min(1).max(60).optional(),
  httpMethod: z.enum(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']).optional()
};

server.tool('uptimerobot.monitor.create', 'Create an uptime monitor. WRITE; explicit operator approval is required by default.', MonitorCreate,
  async (body) => {
    assertWriteAllowed(config, 'uptimerobot.monitor.create');
    return json(await client.request('/monitors', { method: 'POST', body }));
  });

server.tool('uptimerobot.monitor.update', 'Update selected monitor fields. WRITE; explicit operator approval is required by default.', {
  monitor_id: Id,
  friendlyName: z.string().min(1).max(255).optional(),
  url: z.string().url().max(2048).optional(),
  interval: z.number().int().min(60).max(86400).optional(),
  timeout: z.number().int().min(1).max(60).optional(),
  httpMethod: z.enum(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']).optional()
}, async ({ monitor_id, ...body }) => {
  if (Object.keys(body).length === 0) throw new Error('VALIDATION_ERROR: at least one monitor field must be supplied');
  assertWriteAllowed(config, 'uptimerobot.monitor.update');
  return json(await client.request(`/monitors/${encodeURIComponent(String(monitor_id))}`, { method: 'PATCH', body }));
});

server.tool('uptimerobot.monitor.delete', 'Delete a monitor. DESTRUCTIVE; disabled by default and requires explicit strong approval.', { monitor_id: Id },
  async ({ monitor_id }) => {
    assertWriteAllowed(config, 'uptimerobot.monitor.delete', true);
    return json(await client.request(`/monitors/${encodeURIComponent(String(monitor_id))}`, { method: 'DELETE' }));
  });

server.tool('uptimerobot.maintenance_window.list', 'List maintenance windows. READ.', { limit: Limit, cursor: Cursor },
  async ({ limit, cursor }) => json(await client.request('/maintenance-windows', { query: { limit, cursor } })));

server.tool('uptimerobot.maintenance_window.get', 'Get one maintenance window. READ.', { maintenance_window_id: Id },
  async ({ maintenance_window_id }) => json(await client.request(`/maintenance-windows/${encodeURIComponent(String(maintenance_window_id))}`)));

server.tool('uptimerobot.status_page.list', 'List public status pages. READ.', { limit: Limit, cursor: Cursor },
  async ({ limit, cursor }) => json(await client.request('/psps', { query: { limit, cursor } })));

server.tool('uptimerobot.status_page.get', 'Get one public status page. READ.', { status_page_id: Id },
  async ({ status_page_id }) => json(await client.request(`/psps/${encodeURIComponent(String(status_page_id))}`)));

server.tool('uptimerobot.integration.list', 'List alert integrations configured in the account. READ; integration data can contain secrets and must be treated as sensitive untrusted data.', { limit: Limit, cursor: Cursor },
  async ({ limit, cursor }) => json(await client.request('/integrations', { query: { limit, cursor } })));

server.tool('uptimerobot.integration.get', 'Get one alert integration. READ; returned configuration may contain sensitive values.', { integration_id: Id },
  async ({ integration_id }) => json(await client.request(`/integrations/${encodeURIComponent(String(integration_id))}`)));

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
