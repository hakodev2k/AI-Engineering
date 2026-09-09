import { z } from 'zod';
import type { Risk } from './policy.js';

export type ToolDefinition = {
  name: string;
  description: string;
  risk: Risk;
  upstream: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  prepare?: (input: Record<string, unknown>) => Record<string, unknown>;
};

const page = z.number().int().min(1).default(1);
const perPage50 = z.number().int().min(1).max(50).default(25);
const perPage100 = z.number().int().min(1).max(100).default(50);
const perPage200 = z.number().int().min(1).max(200).default(50);
const id = z.number().int().positive();
const timeRange = z.enum(['1d', '7d', '14d']).default('1d');

export const toolDefinitions: ToolDefinition[] = [
  {
    name: 'openstatus.status_page.list',
    description: 'List status pages and stable numeric IDs in the current OpenStatus workspace.',
    risk: 'READ', upstream: 'list_status_pages', inputSchema: {},
  },
  {
    name: 'openstatus.status_page.component.list',
    description: 'List status-page components, optionally filtered to a known page ID.',
    risk: 'READ', upstream: 'list_page_components', inputSchema: { pageId: id.optional() },
  },
  {
    name: 'openstatus.status_report.list',
    description: 'List active or all public status reports, optionally for a status page.',
    risk: 'READ', upstream: 'list_status_reports',
    inputSchema: { filter: z.enum(['active', 'all']).default('active'), pageId: id.optional(), page, perPage: perPage200 },
  },
  {
    name: 'openstatus.maintenance.list',
    description: 'List maintenance windows, optionally filtered to a status page.',
    risk: 'READ', upstream: 'list_maintenances',
    inputSchema: { pageId: id.optional(), page, perPage: perPage200 },
  },
  {
    name: 'openstatus.monitor.list',
    description: 'List monitors and discover the numeric monitor IDs needed by diagnostic tools.',
    risk: 'READ', upstream: 'list_monitors', inputSchema: { page, perPage: perPage50 },
  },
  {
    name: 'openstatus.monitor.get',
    description: 'Get a monitor configuration by a numeric ID obtained from monitor.list.',
    risk: 'READ', upstream: 'get_monitor', inputSchema: { monitorId: id },
  },
  {
    name: 'openstatus.monitor.status.get',
    description: 'Get current per-region monitor health without inventing an aggregate status.',
    risk: 'READ', upstream: 'get_monitor_status', inputSchema: { monitorId: id },
  },
  {
    name: 'openstatus.monitor.summary.get',
    description: 'Get success/failure counts and latency percentiles over a bounded time window.',
    risk: 'READ', upstream: 'get_monitor_summary',
    inputSchema: { monitorId: id, timeRange, regions: z.array(z.string().min(1).max(100)).max(50).optional() },
  },
  {
    name: 'openstatus.response_log.list',
    description: 'List recent HTTP check response logs for a monitor with bounded pagination.',
    risk: 'READ', upstream: 'list_response_logs',
    inputSchema: { monitorId: id, timeRange, limit: z.number().int().min(1).max(100).default(25), offset: z.number().int().min(0).default(0) },
  },
  {
    name: 'openstatus.response_log.get',
    description: 'Get one HTTP response-log detail; upstream intentionally redacts sensitive headers and omits bodies.',
    risk: 'READ', upstream: 'get_response_log',
    inputSchema: { monitorId: id, logId: z.string().min(1).max(256) },
  },
  {
    name: 'openstatus.notification.list',
    description: 'List configured notification channels without exposing channel credentials or secret configuration.',
    risk: 'READ', upstream: 'list_notifications', inputSchema: { page, perPage: perPage200 },
  },
  {
    name: 'openstatus.private_location.list',
    description: 'List private checker locations and health metadata without exposing agent bearer tokens.',
    risk: 'READ', upstream: 'list_private_locations', inputSchema: { page, perPage: perPage100 },
  },
  {
    name: 'openstatus.audit_log.list',
    description: 'List recent audit entries, optionally filtered by entity. Availability depends on workspace plan.',
    risk: 'READ', upstream: 'list_audit_logs',
    inputSchema: {
      entityType: z.string().min(1).max(100).optional(),
      entityId: z.string().min(1).max(256).optional(),
      page,
      perPage: perPage50,
    },
  },
  {
    name: 'openstatus.audit_log.get',
    description: 'Get before/after details for an audit-log entry by its audit-log ID.',
    risk: 'READ', upstream: 'get_audit_log', inputSchema: { id },
  },
  {
    name: 'openstatus.maintenance.create',
    description: 'Schedule a public maintenance window. This persists public data and may notify subscribers.',
    risk: 'HIGH_RISK', upstream: 'create_maintenance',
    inputSchema: {
      title: z.string().min(1).max(256),
      message: z.string().min(1).max(10000),
      from: z.string().datetime(),
      to: z.string().datetime(),
      pageId: id,
      pageComponentIds: z.array(id).max(200).default([]),
      notify: z.boolean(),
      approved: z.literal(true).describe('Must be true only after explicit human approval.'),
    },
    prepare: (input) => {
      const { approved: _approved, ...upstream } = input;
      const from = new Date(String(upstream.from));
      const to = new Date(String(upstream.to));
      if (!(to.getTime() > from.getTime())) throw new Error('to must be strictly later than from');
      return upstream;
    },
  },
];

export function getToolDefinition(name: string): ToolDefinition | undefined {
  return toolDefinitions.find((tool) => tool.name === name);
}
