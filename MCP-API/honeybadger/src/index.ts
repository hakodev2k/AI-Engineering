import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { authorize, assertMutatingInput, type Risk } from './policy.js';
import { HoneybadgerApi } from './api.js';
import { HoneybadgerUpstream } from './upstream.js';

const cfg = loadConfig();
const api = new HoneybadgerApi(cfg);
const upstream = new HoneybadgerUpstream(cfg);
const server = new McpServer({ name: 'honeybadger-connector', version: '1.0.0' });
const positiveInt = z.number().int().positive();
const shortText = z.string().min(1).max(500);
const approval = { approved: z.boolean().optional() };

type Runner = (a: Record<string, any>) => Promise<unknown>;
function result(value: unknown, transport: 'mcp'|'api') {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ provider: 'honeybadger', transport, untrusted_data: true, result: value }, null, 2) }] };
}
function register(name: string, description: string, risk: Risk, schema: Record<string, z.ZodTypeAny>, transport: 'mcp'|'api', run: Runner) {
  server.registerTool(name, { description: `${description} Risk=${risk}. ${risk === 'READ' ? 'No approval required.' : 'Human approval is enforced locally before execution.'}`, inputSchema: schema }, async (args: any) => {
    try {
      authorize(risk, args.approved, cfg);
      const value = await run(args);
      return result(value, transport);
    } catch (e) {
      return { isError: true, content: [{ type: 'text' as const, text: e instanceof Error ? e.message : 'Unknown connector error' }] };
    }
  });
}
function mcp(name: string, description: string, risk: Risk, schema: Record<string,z.ZodTypeAny>, upstreamName: string, before?: (a: any) => void) {
  register(name, description, risk, schema, 'mcp', async a => {
    before?.(a);
    const { approved, ...clean } = a;
    return upstream.call(upstreamName, clean);
  });
}

mcp('honeybadger.project.list','List Honeybadger projects','READ',{ account_id: z.string().min(1).max(128).optional() },'list_projects');
mcp('honeybadger.project.get','Get detailed project information','READ',{ id: positiveInt },'get_project');
mcp('honeybadger.project.report','Read a project report','READ',{ project_id: positiveInt, report: z.enum(['notices_by_class','notices_by_location','notices_by_user','notices_per_day']), start: z.string().datetime().optional(), stop: z.string().datetime().optional(), environment: z.string().max(128).optional() },'get_project_report');
mcp('honeybadger.project.create','Create a Honeybadger project','WRITE',{ name: shortText, account_id: z.string().min(1).max(128).optional(), resolve_errors_on_deploy: z.boolean().optional(), disable_public_links: z.boolean().optional(), purge_days: z.number().int().positive().max(3650).optional(), ...approval },'create_project');
mcp('honeybadger.project.update','Update project settings','WRITE',{ id: positiveInt, name: shortText.optional(), resolve_errors_on_deploy: z.boolean().optional(), disable_public_links: z.boolean().optional(), purge_days: z.number().int().positive().max(3650).optional(), ...approval },'update_project', a => assertMutatingInput(a,['name','resolve_errors_on_deploy','disable_public_links','purge_days']));
mcp('honeybadger.project.delete','Permanently delete a Honeybadger project','DESTRUCTIVE',{ id: positiveInt, ...approval },'delete_project');

mcp('honeybadger.fault.list','Search and list errors/faults','READ',{ project_id: positiveInt, q: z.string().max(1000).optional(), created_after: z.string().optional(), occurred_after: z.string().optional(), occurred_before: z.string().optional(), limit: z.number().int().min(1).max(25).optional(), order: z.enum(['recent','frequent']).optional(), page: z.number().int().min(1).optional() },'list_faults');
mcp('honeybadger.fault.get','Get one error/fault','READ',{ project_id: positiveInt, fault_id: positiveInt },'get_fault');
mcp('honeybadger.fault.counts','Get fault count statistics','READ',{ project_id: positiveInt, q: z.string().max(1000).optional(), created_after: z.string().optional(), occurred_after: z.string().optional(), occurred_before: z.string().optional() },'get_fault_counts');
mcp('honeybadger.fault.notices','List individual occurrences for a fault','READ',{ project_id: positiveInt, fault_id: positiveInt, created_after: z.string().optional(), created_before: z.string().optional(), limit: z.number().int().min(1).max(25).optional() },'list_fault_notices');
mcp('honeybadger.fault.affected_users','List users affected by a fault','READ',{ project_id: positiveInt, fault_id: positiveInt, q: z.string().max(1000).optional() },'list_fault_affected_users');
mcp('honeybadger.fault.update','Resolve, ignore, assign, or mark a fault for resolution on deploy','WRITE',{ project_id: positiveInt, fault_id: positiveInt, resolved: z.boolean().optional(), ignored: z.boolean().optional(), assignee_id: z.number().int().positive().nullable().optional(), resolve_on_deploy: z.boolean().optional(), ...approval },'update_fault', a => assertMutatingInput(a,['resolved','ignored','assignee_id','resolve_on_deploy']));

mcp('honeybadger.insights.query','Run a BadgerQL query against Insights data','READ',{ project_id: positiveInt, query: z.string().min(1).max(10000), ts: z.string().max(64).optional(), timezone: z.string().max(128).optional(), stream_ids: z.array(z.string().min(1).max(128)).max(32).optional() },'query_insights');
mcp('honeybadger.stream.list','List Insights streams for a project','READ',{ project_id: positiveInt },'list_streams');
mcp('honeybadger.check_in.list','List scheduled-task check-ins','READ',{ project_id: positiveInt },'list_check_ins');
mcp('honeybadger.check_in.get','Get one scheduled-task check-in','READ',{ project_id: positiveInt, check_in_id: z.string().min(1).max(128) },'get_check_in');

register('honeybadger.uptime.list','List uptime checks for a project. Uses the Data API because uptime tools are not currently exposed by the official MCP server.','READ',{ project_id: positiveInt },'api', a => api.request('GET',`/v2/projects/${a.project_id}/sites`));
register('honeybadger.uptime.get','Get one uptime check. Uses the Data API fallback.','READ',{ project_id: positiveInt, site_id: z.string().uuid() },'api', a => api.request('GET',`/v2/projects/${a.project_id}/sites/${encodeURIComponent(a.site_id)}`));
register('honeybadger.uptime.outages','List outages for an uptime check. Uses the Data API fallback.','READ',{ project_id: positiveInt, site_id: z.string().uuid() },'api', a => api.request('GET',`/v2/projects/${a.project_id}/sites/${encodeURIComponent(a.site_id)}/outages`));
register('honeybadger.uptime.history','List recent uptime check executions. Uses the Data API fallback.','READ',{ project_id: positiveInt, site_id: z.string().uuid(), created_after: z.number().int().positive().optional(), created_before: z.number().int().positive().optional(), limit: z.number().int().min(1).max(25).optional() },'api', a => {
  const { project_id, site_id, ...query } = a;
  return api.request('GET',`/v2/projects/${project_id}/sites/${encodeURIComponent(site_id)}/uptime_checks`,undefined,query);
});

await server.connect(new StdioServerTransport());
