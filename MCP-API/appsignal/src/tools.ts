import { z } from 'zod';
import type { Config } from './config.js';
import { AppSignalUpstream } from './upstream.js';
import { enforceApproval, UNTRUSTED_CONTENT_NOTICE, type Risk } from './policy.js';

export interface ToolSpec {
  name: string;
  description: string;
  upstream: string;
  risk: Risk;
  approvalRequired: boolean;
  schema: z.ZodTypeAny;
  map: (input: any) => Record<string, unknown>;
}

const appScope = {
  appId: z.string().min(1),
  environment: z.string().min(1).optional()
};
const range = {
  start: z.string().min(1).optional(),
  end: z.string().min(1).optional()
};
const tags = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional();

export const TOOL_SPECS: ToolSpec[] = [
  {
    name: 'appsignal.app.resources', description: 'Read AppSignal application resources such as apps, environments, namespaces, users, notifiers, log sources, log actions, or deploy markers.', upstream: 'get_app_resources', risk: 'READ', approvalRequired: false,
    schema: z.object({ resourceType: z.enum(['apps','environments','namespaces','users','notifiers','log_sources','log_line_actions','deploy_markers']), appId: z.string().min(1).optional(), environment: z.string().min(1).optional() }).strict(),
    map: i => ({ resource: i.resourceType, app_id: i.appId, environment: i.environment })
  },
  {
    name: 'appsignal.logging.search', description: 'Search application log lines using AppSignal logging query syntax.', upstream: 'get_log_lines', risk: 'READ', approvalRequired: false,
    schema: z.object({ ...appScope, query: z.string().min(1).max(2000), ...range, limit: z.number().int().min(1).max(500).default(100) }).strict(),
    map: i => ({ app_id: i.appId, environment: i.environment, query: i.query, start: i.start, end: i.end, limit: i.limit })
  },
  {
    name: 'appsignal.metric.names', description: 'List metric names available to an AppSignal application.', upstream: 'get_metric_names', risk: 'READ', approvalRequired: false,
    schema: z.object({ ...appScope, category: z.string().min(1).optional() }).strict(),
    map: i => ({ app_id: i.appId, environment: i.environment, category: i.category })
  },
  {
    name: 'appsignal.metric.tags', description: 'List tags for a specific AppSignal metric.', upstream: 'get_metric_tags', risk: 'READ', approvalRequired: false,
    schema: z.object({ ...appScope, metric: z.string().min(1) }).strict(),
    map: i => ({ app_id: i.appId, environment: i.environment, metric: i.metric })
  },
  {
    name: 'appsignal.metric.timeseries', description: 'Query time-series values for a metric.', upstream: 'get_metrics_timeseries', risk: 'READ', approvalRequired: false,
    schema: z.object({ ...appScope, metric: z.string().min(1), tags, ...range }).strict(),
    map: i => ({ app_id: i.appId, environment: i.environment, metric: i.metric, tags: i.tags, start: i.start, end: i.end })
  },
  {
    name: 'appsignal.metric.aggregate', description: 'Query aggregated metric values.', upstream: 'get_metrics_list', risk: 'READ', approvalRequired: false,
    schema: z.object({ ...appScope, metric: z.string().min(1), tags, ...range }).strict(),
    map: i => ({ app_id: i.appId, environment: i.environment, metric: i.metric, tags: i.tags, start: i.start, end: i.end })
  },
  {
    name: 'appsignal.uptime.errors', description: 'Read uptime monitor error-count time series through AppSignal metrics.', upstream: 'get_metrics_timeseries', risk: 'READ', approvalRequired: false,
    schema: z.object({ ...appScope, monitor: z.string().min(1).optional(), ...range }).strict(),
    map: i => ({ app_id: i.appId, environment: i.environment, metric: 'uptime_monitor_error_count', tags: i.monitor ? { monitor: i.monitor } : undefined, start: i.start, end: i.end })
  },
  {
    name: 'appsignal.uptime.duration', description: 'Read uptime monitor duration time series through AppSignal metrics.', upstream: 'get_metrics_timeseries', risk: 'READ', approvalRequired: false,
    schema: z.object({ ...appScope, monitor: z.string().min(1).optional(), ...range }).strict(),
    map: i => ({ app_id: i.appId, environment: i.environment, metric: 'uptime_monitor_duration', tags: i.monitor ? { monitor: i.monitor } : undefined, start: i.start, end: i.end })
  },
  {
    name: 'appsignal.deploy.list', description: 'List deploy markers for an application.', upstream: 'get_app_resources', risk: 'READ', approvalRequired: false,
    schema: z.object({ ...appScope }).strict(),
    map: i => ({ resource: 'deploy_markers', app_id: i.appId, environment: i.environment })
  },
  {
    name: 'appsignal.user.list', description: 'List AppSignal users visible to the scoped token.', upstream: 'get_app_resources', risk: 'READ', approvalRequired: false,
    schema: z.object({ appId: z.string().min(1).optional() }).strict(),
    map: i => ({ resource: 'users', app_id: i.appId })
  },
  {
    name: 'appsignal.notifier.list', description: 'List configured notifiers without modifying notification routing.', upstream: 'get_app_resources', risk: 'READ', approvalRequired: false,
    schema: z.object({ appId: z.string().min(1), environment: z.string().min(1).optional() }).strict(),
    map: i => ({ resource: 'notifiers', app_id: i.appId, environment: i.environment })
  },
  {
    name: 'appsignal.log_source.list', description: 'List log sources for an application.', upstream: 'get_app_resources', risk: 'READ', approvalRequired: false,
    schema: z.object({ appId: z.string().min(1), environment: z.string().min(1).optional() }).strict(),
    map: i => ({ resource: 'log_sources', app_id: i.appId, environment: i.environment })
  }
];

function compact(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined));
}

export async function executeTool(spec: ToolSpec, input: unknown, upstream: AppSignalUpstream, config: Config): Promise<unknown> {
  const parsed = spec.schema.parse(input);
  enforceApproval(spec.name, spec.risk, { approved: (parsed as any).approved }, config.writeApprovalRequired);
  const available = await upstream.listTools();
  if (!available.some(t => t.name === spec.upstream)) {
    throw new Error(`Required official AppSignal MCP capability is unavailable: ${spec.upstream}`);
  }
  const result = await upstream.callTool(spec.upstream, compact(spec.map(parsed)));
  return { provider: 'AppSignal', transport: 'official-mcp', risk: spec.risk, notice: UNTRUSTED_CONTENT_NOTICE, result };
}
