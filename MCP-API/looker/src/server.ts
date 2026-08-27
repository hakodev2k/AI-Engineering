import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { LookerRestClient } from './rest.js';
import { LookerManagedMcp } from './upstream-mcp.js';

const config = loadConfig();
const rest = new LookerRestClient(config);
const managed = new LookerManagedMcp(config);
const server = new McpServer({ name: 'looker-connector', version: '1.0.0' });
const out = (v: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(v) }] });

server.tool('looker.model.list', 'List LookML models visible to the authenticated user.', {}, async () => out(await rest.request('GET', '/lookml_models')));
server.tool('looker.explore.get', 'Get Explore metadata.', { model: z.string().min(1), explore: z.string().min(1) }, async ({ model, explore }) => out(await rest.request('GET', `/lookml_models/${encodeURIComponent(model)}/explores/${encodeURIComponent(explore)}`)));
server.tool('looker.look.get', 'Get a saved Look.', { lookId: z.string().min(1) }, async ({ lookId }) => out(await rest.request('GET', `/looks/${encodeURIComponent(lookId)}`)));
server.tool('looker.dashboard.get', 'Get a dashboard.', { dashboardId: z.string().min(1) }, async ({ dashboardId }) => out(await rest.request('GET', `/dashboards/${encodeURIComponent(dashboardId)}`)));
server.tool('looker.content.search', 'Search dashboards and Looks by title.', { title: z.string().min(1), limit: z.number().int().min(1).max(100).default(20) }, async ({ title, limit }) => out(await rest.request('GET', '/content_metadata/search', { query: { title, limit } })));

server.tool('looker.query.run', 'Run a governed Explore query. Uses official managed MCP looker_query when configured, otherwise REST API 4.0.', {
  model: z.string().min(1),
  explore: z.string().min(1),
  fields: z.array(z.string().min(1)).min(1).max(100),
  filters: z.record(z.string()).optional(),
  sorts: z.array(z.string()).max(20).optional(),
  limit: z.number().int().min(1).max(5000).default(500)
}, async ({ model, explore, fields, filters, sorts, limit }) => {
  const mcpArgs = { model, explore, fields, filters: Object.entries(filters ?? {}).map(([field, value]) => ({ field, value })), sorts, limit: String(limit) };
  if (config.useMcp && config.mcpAccessToken) {
    try { return out(await managed.query(mcpArgs)); } catch (e) {
      if (!(e instanceof Error) || !/not enabled|configured|fetch|timeout|connect/i.test(e.message)) throw e;
    }
  }
  const q = await rest.request<{ id?: string; slug?: string }>('POST', '/queries', { body: { model, view: explore, fields, filters, sorts, limit }, retryable: false });
  const id = q.id ?? q.slug;
  if (!id) throw new Error('Looker did not return a query id');
  return out(await rest.request('GET', `/queries/${encodeURIComponent(id)}/run/json`, { retryable: true }));
});

server.tool('looker.scheduled_plan.search', 'Search scheduled plans owned by caller unless allUsers is explicitly requested and permitted.', {
  allUsers: z.boolean().default(false), limit: z.number().int().min(1).max(100).default(20)
}, async ({ allUsers, limit }) => out(await rest.request('GET', '/scheduled_plans/search', { query: { all_users: allUsers, limit } })));
server.tool('looker.scheduled_plan.get', 'Get a scheduled plan.', { id: z.string().min(1) }, async ({ id }) => out(await rest.request('GET', `/scheduled_plans/${encodeURIComponent(id)}`)));

const approval = z.string().min(1);
server.tool('looker.scheduled_plan.create', 'Create a recurring Looker delivery. External delivery is high risk and requires human approval.', {
  name: z.string().min(1).max(200), lookId: z.string().min(1).optional(), dashboardId: z.string().min(1).optional(), cronTab: z.string().min(1), destinationType: z.enum(['email','webhook','s3','sftp']), address: z.string().min(1), format: z.string().min(1), approvalId: approval
}, async (a) => {
  assertApproval('looker.scheduled_plan.create', a.approvalId, config.approvalSecret);
  if (!a.lookId && !a.dashboardId) throw new Error('lookId or dashboardId is required');
  const body: Record<string, unknown> = { name: a.name, cron_tab: a.cronTab, scheduled_plan_destination: [{ type: a.destinationType, address: a.address, format: a.format }] };
  if (a.lookId) body.look_id = a.lookId; else body.dashboard_id = a.dashboardId;
  return out(await rest.request('POST', '/scheduled_plans', { body, retryable: false }));
});
server.tool('looker.scheduled_plan.run', 'Run an existing scheduled plan once. This can send data externally and requires human approval.', { id: z.string().min(1), approvalId: approval }, async ({ id, approvalId }) => {
  assertApproval('looker.scheduled_plan.run', approvalId, config.approvalSecret);
  return out(await rest.request('POST', `/scheduled_plans/${encodeURIComponent(id)}/run_once`, { retryable: false }));
});
server.tool('looker.scheduled_plan.delete', 'Delete a scheduled plan. Destructive and requires human approval.', { id: z.string().min(1), approvalId: approval }, async ({ id, approvalId }) => {
  assertApproval('looker.scheduled_plan.delete', approvalId, config.approvalSecret);
  return out(await rest.request('DELETE', `/scheduled_plans/${encodeURIComponent(id)}`, { retryable: false }));
});

await server.connect(new StdioServerTransport());
