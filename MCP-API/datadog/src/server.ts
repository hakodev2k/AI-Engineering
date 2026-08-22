import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { DatadogClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new DatadogClient(config);
const server = new McpServer({ name: 'datadog-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const MonitorId = z.number().int().positive();
const DashboardId = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const IncidentId = z.string().uuid();

server.tool('datadog.auth.validate', 'Validate the configured Datadog API key. READ.', {},
  async () => json(await client.request('/api/v1/validate')));

server.tool('datadog.monitor.list', 'List monitors visible to the configured application key. READ.', {
  name: z.string().min(1).max(200).optional(),
  tags: z.string().max(1000).optional(),
  monitor_tags: z.string().max(1000).optional(),
  with_downtimes: z.boolean().default(false),
  page: z.number().int().min(0).max(10000).default(0),
  page_size: z.number().int().min(1).max(100).default(50)
}, async (args) => json(await client.request('/api/v1/monitor', { query: args })));

server.tool('datadog.monitor.get', 'Get one monitor and its current definition. READ.', { monitor_id: MonitorId },
  async ({ monitor_id }) => json(await client.request(`/api/v1/monitor/${monitor_id}`)));

const Thresholds = z.object({
  critical: z.number().optional(),
  warning: z.number().optional(),
  critical_recovery: z.number().optional(),
  warning_recovery: z.number().optional()
}).strict().optional();

const MonitorOptions = z.object({
  thresholds: Thresholds,
  notify_no_data: z.boolean().optional(),
  no_data_timeframe: z.number().int().min(1).max(10080).optional(),
  renotify_interval: z.number().int().min(0).max(10080).optional(),
  include_tags: z.boolean().optional(),
  require_full_window: z.boolean().optional(),
  evaluation_delay: z.number().int().min(0).max(86400).optional()
}).strict().optional();

const MonitorBody = {
  name: z.string().min(1).max(500),
  type: z.enum(['metric alert', 'query alert', 'service check', 'composite', 'log alert', 'process alert', 'event-v2 alert', 'slo alert', 'rum alert', 'trace-analytics alert']),
  query: z.string().min(1).max(10000),
  message: z.string().max(4000).default(''),
  tags: z.array(z.string().min(1).max(200)).max(100).optional(),
  priority: z.number().int().min(1).max(5).optional(),
  options: MonitorOptions
};

server.tool('datadog.monitor.create', 'Create a monitor. WRITE; explicit operator approval is required by default.', MonitorBody,
  async (body) => { assertWriteAllowed(config, 'datadog.monitor.create'); return json(await client.request('/api/v1/monitor', { method: 'POST', body })); });

server.tool('datadog.monitor.update', 'Replace supported fields of an existing monitor. WRITE; explicit operator approval is required by default.', { monitor_id: MonitorId, ...MonitorBody },
  async ({ monitor_id, ...body }) => { assertWriteAllowed(config, 'datadog.monitor.update'); return json(await client.request(`/api/v1/monitor/${monitor_id}`, { method: 'PUT', body })); });

server.tool('datadog.monitor.delete', 'Delete a monitor. DESTRUCTIVE; disabled by default and requires explicit strong approval.', { monitor_id: MonitorId },
  async ({ monitor_id }) => { assertWriteAllowed(config, 'datadog.monitor.delete', true); return json(await client.request(`/api/v1/monitor/${monitor_id}`, { method: 'DELETE' })); });

server.tool('datadog.dashboard.list', 'List dashboards. READ.', {
  filter_shared: z.boolean().optional(),
  filter_deleted: z.boolean().optional(),
  count: z.number().int().min(1).max(100).default(50),
  start: z.number().int().min(0).max(100000).default(0)
}, async (args) => json(await client.request('/api/v1/dashboard', { query: args })));

server.tool('datadog.dashboard.get', 'Get one dashboard definition. READ.', { dashboard_id: DashboardId },
  async ({ dashboard_id }) => json(await client.request(`/api/v1/dashboard/${encodeURIComponent(dashboard_id)}`)));

server.tool('datadog.incident.list', 'List incidents for the organization. READ; Datadog Incidents API is currently public beta.', {
  page_size: z.number().int().min(1).max(100).default(25),
  page_offset: z.number().int().min(0).max(100000).default(0),
  include: z.string().max(500).optional()
}, async ({ page_size, page_offset, include }) => json(await client.request('/api/v2/incidents', { query: { 'page[size]': page_size, 'page[offset]': page_offset, include } })));

server.tool('datadog.incident.get', 'Get one incident. READ; Datadog Incidents API is currently public beta.', { incident_id: IncidentId },
  async ({ incident_id }) => json(await client.request(`/api/v2/incidents/${incident_id}`)));

server.tool('datadog.metric.query', 'Query Datadog timeseries points for a bounded time window. READ.', {
  from: z.number().int().positive(),
  to: z.number().int().positive(),
  query: z.string().min(1).max(5000)
}, async ({ from, to, query }) => {
  if (to <= from) throw new Error('VALIDATION_ERROR: to must be greater than from');
  if (to - from > 31 * 24 * 3600) throw new Error('VALIDATION_ERROR: time window is limited to 31 days per tool call');
  return json(await client.request('/api/v1/query', { query: { from, to, query } }));
});

server.tool('datadog.event.list', 'List Event Management events with bounded pagination. READ.', {
  page_limit: z.number().int().min(1).max(100).default(25),
  page_cursor: z.string().max(500).optional(),
  filter_from: z.string().datetime().optional(),
  filter_to: z.string().datetime().optional(),
  filter_query: z.string().max(2000).optional(),
  sort: z.enum(['timestamp', '-timestamp']).default('-timestamp')
}, async ({ page_limit, page_cursor, filter_from, filter_to, filter_query, sort }) => json(await client.request('/api/v2/events', { query: {
  'page[limit]': page_limit, 'page[cursor]': page_cursor, 'filter[from]': filter_from, 'filter[to]': filter_to, 'filter[query]': filter_query, sort
} })));

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
