import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { BetterStackClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';
import { BetterStackMcpClient } from './upstream-mcp.js';

const config = loadConfig();
const api = new BetterStackClient(config);
const upstream = new BetterStackMcpClient(config);
const server = new McpServer({ name: 'better-stack-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const ResourceId = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const TeamName = z.string().min(1).max(200).optional();

async function mcpFirst<T>(tool: 'monitors' | 'monitor' | 'incidents', args: Record<string, unknown>, fallback: () => Promise<T>) {
  try { return await upstream.call(tool, args); } catch { return fallback(); }
}

server.tool('betterstack.monitor.list', 'List uptime monitors. READ. Uses official Better Stack MCP first, then REST fallback.', {
  team_name: TeamName,
  url: z.string().url().optional(),
  pronounceable_name: z.string().min(1).max(300).optional(),
  page: z.number().int().min(1).max(10000).default(1)
}, async (args) => json(await mcpFirst('monitors', args, () => api.request('/api/v2/monitors', { query: args }))));

server.tool('betterstack.monitor.get', 'Get one uptime monitor. READ. Uses official Better Stack MCP first, then REST fallback.', {
  monitor_id: ResourceId
}, async ({ monitor_id }) => json(await mcpFirst('monitor', { monitor_id }, () => api.request(`/api/v2/monitors/${monitor_id}`))));

server.tool('betterstack.monitor.create', 'Create an uptime monitor. WRITE; explicit operator approval is required by default.', {
  url: z.string().url(),
  pronounceable_name: z.string().min(1).max(300).optional(),
  monitor_type: z.enum(['status', 'expected_status_code', 'keyword', 'keyword_absence', 'ping', 'tcp', 'udp']).default('status'),
  check_frequency: z.number().int().min(30).max(86400).optional(),
  required_keyword: z.string().max(1000).optional(),
  port: z.number().int().min(1).max(65535).optional(),
  team_name: TeamName,
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  call: z.boolean().default(false),
  push: z.boolean().default(false)
}, async (body) => {
  assertWriteAllowed(config, 'betterstack.monitor.create');
  return json(await api.request('/api/v2/monitors', { method: 'POST', body }));
});

server.tool('betterstack.heartbeat.list', 'List heartbeat monitors. READ.', {
  team_name: TeamName,
  page: z.number().int().min(1).max(10000).default(1)
}, async (args) => json(await api.request('/api/v2/heartbeats', { query: args })));

server.tool('betterstack.heartbeat.get', 'Get one heartbeat monitor. READ.', {
  heartbeat_id: ResourceId
}, async ({ heartbeat_id }) => json(await api.request(`/api/v2/heartbeats/${heartbeat_id}`)));

server.tool('betterstack.heartbeat.create', 'Create a heartbeat monitor. WRITE; explicit operator approval is required by default.', {
  name: z.string().min(1).max(300),
  period: z.number().int().min(30).max(2592000),
  grace: z.number().int().min(0).max(604800).default(0),
  team_name: TeamName,
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  call: z.boolean().default(false),
  push: z.boolean().default(false),
  critical_alert: z.boolean().default(false)
}, async (body) => {
  assertWriteAllowed(config, 'betterstack.heartbeat.create');
  return json(await api.request('/api/v2/heartbeats', { method: 'POST', body }));
});

server.tool('betterstack.incident.list', 'List incidents with bounded filtering. READ. Uses official Better Stack MCP first, then REST fallback.', {
  team_name: TeamName,
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  monitor_id: z.number().int().positive().optional(),
  heartbeat_id: z.number().int().positive().optional(),
  resolved: z.boolean().optional(),
  acknowledged: z.boolean().optional(),
  page: z.number().int().min(1).max(10000).default(1)
}, async (args) => json(await mcpFirst('incidents', args, () => api.request('/api/v3/incidents', { query: args }))));

server.tool('betterstack.incident.get', 'Get one incident. READ.', {
  incident_id: ResourceId
}, async ({ incident_id }) => json(await api.request(`/api/v3/incidents/${incident_id}`)));

server.tool('betterstack.on_call.list', 'List on-call schedules and current on-call users. READ.', {
  team_name: TeamName,
  page: z.number().int().min(1).max(10000).default(1)
}, async (args) => json(await api.request('/api/v2/on-calls', { query: args })));

server.tool('betterstack.on_call.events', 'List events for one on-call schedule. READ.', {
  schedule_id: z.union([ResourceId, z.literal('default')])
}, async ({ schedule_id }) => json(await api.request(`/api/v2/on-calls/${schedule_id}/events`)));

server.tool('betterstack.status_page.list', 'List status pages. READ.', {
  team_name: TeamName,
  page: z.number().int().min(1).max(10000).default(1)
}, async (args) => json(await api.request('/api/v2/status-pages', { query: args })));

server.tool('betterstack.status_page.get', 'Get one status page and aggregate state. READ.', {
  status_page_id: ResourceId
}, async ({ status_page_id }) => json(await api.request(`/api/v2/status-pages/${status_page_id}`)));

process.on('SIGINT', async () => { await upstream.close(); process.exit(0); });
process.on('SIGTERM', async () => { await upstream.close(); process.exit(0); });
await server.connect(new StdioServerTransport());
