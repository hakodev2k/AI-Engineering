import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertWriteAllowed, loadConfig } from './config.js';
import { GrafanaUpstream, grafanaHealth } from './upstream.js';

const config = loadConfig();
const upstream = new GrafanaUpstream(config);
const server = new McpServer({ name: 'grafana-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Uid = z.string().min(1).max(256).regex(/^[A-Za-z0-9._-]+$/);

server.tool('grafana.mcp.status', 'Check the official Grafana MCP connection and report only allowlisted upstream tools. READ.', {},
  async () => json(await upstream.status()));

server.tool('grafana.health.get', 'Read Grafana instance health through the official HTTP API fallback. READ.', {},
  async () => json(await grafanaHealth(config)));

server.tool('grafana.dashboard.search', 'Search dashboards through official Grafana MCP. READ. Requires dashboards:read.', {
  query: z.string().max(300).default(''),
  limit: z.number().int().min(1).max(100).default(50),
  page: z.number().int().min(1).max(10000).default(1)
}, async (args) => json(await upstream.call('search_dashboards', args)));

server.tool('grafana.folder.search', 'Search folders through official Grafana MCP. READ. Requires folders:read.', {
  query: z.string().max(300).default('')
}, async (args) => json(await upstream.call('search_folders', args)));

server.tool('grafana.dashboard.get', 'Get a dashboard by UID through official Grafana MCP. READ. Requires dashboards:read.', { uid: Uid },
  async (args) => json(await upstream.call('get_dashboard_by_uid', args)));

server.tool('grafana.dashboard.summary', 'Get a compact dashboard summary through official Grafana MCP. READ. Requires dashboards:read.', { uid: Uid },
  async (args) => json(await upstream.call('get_dashboard_summary', args)));

server.tool('grafana.dashboard.panel_queries', 'Get dashboard panel queries through official Grafana MCP. READ. Requires dashboards:read.', { uid: Uid },
  async (args) => json(await upstream.call('get_dashboard_panel_queries', args)));

server.tool('grafana.datasource.list', 'List configured datasources through official Grafana MCP. READ. Requires datasources:read.', {
  type: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(200).optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).max(100000).default(0)
}, async (args) => json(await upstream.call('list_datasources', args)));

server.tool('grafana.datasource.get', 'Get a datasource by UID or name through official Grafana MCP. READ. Requires datasources:read.', {
  uid: Uid.optional(),
  name: z.string().min(1).max(200).optional()
}, async (args) => {
  if (!args.uid && !args.name) throw new Error('VALIDATION_ERROR: uid or name is required');
  if (args.uid && args.name) throw new Error('VALIDATION_ERROR: provide only uid or name');
  return json(await upstream.call('get_datasource', args));
});

const DashboardOperation = z.object({
  op: z.enum(['replace', 'add', 'remove']),
  path: z.string().min(1).max(1000).startsWith('$.'),
  value: z.unknown().optional()
}).strict();

server.tool('grafana.dashboard.upsert', 'Create or update a dashboard through official Grafana MCP. WRITE; explicit operator approval is required by default.', {
  uid: Uid.optional(),
  dashboard: z.record(z.unknown()).optional(),
  operations: z.array(DashboardOperation).min(1).max(50).optional(),
  folderUid: Uid.optional(),
  message: z.string().max(500).optional(),
  overwrite: z.boolean().default(false)
}, async (args) => {
  assertWriteAllowed(config, 'grafana.dashboard.upsert');
  if (!args.dashboard && !args.operations) throw new Error('VALIDATION_ERROR: dashboard or operations is required');
  if (args.operations && !args.uid) throw new Error('VALIDATION_ERROR: uid is required when using operations');
  return json(await upstream.call('update_dashboard', args));
});

server.tool('grafana.folder.create', 'Create a folder through official Grafana MCP. WRITE; explicit operator approval is required by default.', {
  title: z.string().min(1).max(255),
  uid: Uid.optional()
}, async (args) => {
  assertWriteAllowed(config, 'grafana.folder.create');
  return json(await upstream.call('create_folder', args));
});

process.on('SIGINT', async () => { await upstream.close(); process.exit(0); });
process.on('SIGTERM', async () => { await upstream.close(); process.exit(0); });
await server.connect(new StdioServerTransport());
