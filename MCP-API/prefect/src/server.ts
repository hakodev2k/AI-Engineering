import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { PrefectClient, cleanProviderData } from './client.js';
import { authorize, type Risk } from './policy.js';

const cfg = loadConfig();
const api = new PrefectClient(cfg);
const server = new McpServer({ name: 'prefect-safe-connector', version: '1.0.0' });
const uuid = z.string().uuid();
const name = z.string().min(1).max(255).refine(v => !/[\/%&><]/.test(v), 'Invalid Prefect name');
const limit = z.number().int().min(1).max(200).default(50);
const offset = z.number().int().min(0).default(0);
const approval = z.string().regex(/^[a-f0-9]{64}$/i).optional();
const filterObject = z.record(z.unknown()).default({});

type Runner = (args: any) => Promise<unknown>;
function output(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ provider: 'prefect', untrusted_provider_data: true, result: cleanProviderData(value) }, null, 2) }] };
}
function register(tool: string, description: string, risk: Risk, schema: any, run: Runner) {
  server.registerTool(tool, { description: `${description} Risk=${risk}. ${risk === 'READ' ? 'No approval required.' : 'Requires payload-bound human approval.'}`, inputSchema: schema }, async (args: any) => {
    try {
      const { approval_token, ...payload } = args;
      authorize(cfg, tool, risk, payload, approval_token);
      return output(await run(payload));
    } catch (error) {
      return { isError: true, content: [{ type: 'text' as const, text: error instanceof Error ? error.message : 'Unknown connector error' }] };
    }
  });
}

register('prefect.deployment.list', 'Filter deployments with bounded pagination', 'READ', { deployments: filterObject.optional(), flows: filterObject.optional(), work_pools: filterObject.optional(), work_pool_queues: filterObject.optional(), limit, offset }, a => api.request('POST', '/deployments/filter', a, true));
register('prefect.deployment.get', 'Get a deployment by UUID', 'READ', { deployment_id: uuid }, a => api.request('GET', `/deployments/${a.deployment_id}`));
register('prefect.deployment.run', 'Create a scheduled flow run from a deployment', 'HIGH_RISK', { deployment_id: uuid, name: z.string().min(1).max(255).optional(), parameters: z.record(z.unknown()).optional(), tags: z.array(z.string().min(1).max(255)).max(50).optional(), idempotency_key: z.string().min(1).max(255).optional(), job_variables: z.record(z.unknown()).optional(), approval_token: approval }, a => { const { deployment_id, ...body } = a; return api.request('POST', `/deployments/${deployment_id}/create_flow_run`, body, false); });
register('prefect.flow_run.list', 'Filter flow runs by Prefect-supported filter objects', 'READ', { flow_runs: filterObject.optional(), flows: filterObject.optional(), deployments: filterObject.optional(), task_runs: filterObject.optional(), work_pools: filterObject.optional(), work_pool_queues: filterObject.optional(), limit, offset }, a => api.request('POST', '/flow_runs/filter', a, true));
register('prefect.flow_run.get', 'Get one flow run by UUID', 'READ', { flow_run_id: uuid }, a => api.request('GET', `/flow_runs/${a.flow_run_id}`));
register('prefect.flow_run.cancel', 'Request cancellation of a flow run by setting CANCELLING state', 'HIGH_RISK', { flow_run_id: uuid, reason: z.string().min(3).max(500), approval_token: approval }, a => api.request('POST', `/flow_runs/${a.flow_run_id}/set_state`, { state: { type: 'CANCELLING', message: a.reason } }, false));
register('prefect.task_run.list', 'Filter task runs with bounded pagination', 'READ', { task_runs: filterObject.optional(), flow_runs: filterObject.optional(), flows: filterObject.optional(), deployments: filterObject.optional(), limit, offset }, a => api.request('POST', '/task_runs/filter', a, true));
register('prefect.work_pool.list', 'List/filter work pools', 'READ', { work_pools: filterObject.optional(), limit, offset }, a => api.request('POST', '/work_pools/filter', a, true));
register('prefect.work_pool.get', 'Get a work pool by name', 'READ', { work_pool_name: name }, a => api.request('GET', `/work_pools/${encodeURIComponent(a.work_pool_name)}`));
register('prefect.work_queue.list', 'List work queues within a work pool', 'READ', { work_pool_name: name, work_queues: filterObject.optional(), limit, offset }, a => { const { work_pool_name, ...body } = a; return api.request('POST', `/work_pools/${encodeURIComponent(work_pool_name)}/queues/filter`, body, true); });
register('prefect.worker.list', 'List workers and heartbeat/status data for a work pool', 'READ', { work_pool_name: name, workers: filterObject.optional(), limit, offset }, a => { const { work_pool_name, ...body } = a; return api.request('POST', `/work_pools/${encodeURIComponent(work_pool_name)}/workers/filter`, body, true); });

await server.connect(new StdioServerTransport());
