import { z } from 'zod';
import type { Risk } from './policy.js';
import type { ToolBinding } from './upstream.js';

const id = z.string().min(1).max(128);
const perPage = z.number().int().min(1).max(100).optional();
const projectId = id.optional();
const nextUrl = z.string().url().max(2048).optional();
const eqFilter = z.record(z.string().min(1).max(128), z.array(z.object({ type: z.literal('eq'), value: z.union([z.string(), z.number(), z.boolean()]) })).min(1).max(20)).optional();

export type ToolSpec = {
  name: string;
  purpose: string;
  risk: Risk;
  approval: 'none' | 'configurable' | 'required';
  schema: z.ZodRawShape;
  binding: ToolBinding;
  mapArgs?: (args: Record<string, unknown>) => Record<string, unknown>;
};

export const toolSpecs: ToolSpec[] = [
  {
    name: 'bugsnag.project.list',
    purpose: 'List BugSnag projects visible to the authenticated user.',
    risk: 'READ', approval: 'none',
    schema: { api_key: z.string().min(1).max(128).optional() },
    binding: { aliases: ['list_bugsnag_projects', 'bugsnag_list_projects'], requiredTerms: ['list', 'projects'] },
    mapArgs: a => a.api_key ? { apiKey: a.api_key } : {}
  },
  {
    name: 'bugsnag.project.current',
    purpose: 'Get the project currently selected by the upstream BugSnag MCP server.',
    risk: 'READ', approval: 'none', schema: {},
    binding: { aliases: ['get_current_bugsnag_project', 'bugsnag_get_current_project'], requiredTerms: ['current', 'project'] }
  },
  {
    name: 'bugsnag.error.list',
    purpose: 'List and filter errors for a project.',
    risk: 'READ', approval: 'none',
    schema: {
      project_id: projectId,
      filters: eqFilter,
      sort: z.enum(['last_seen', 'first_seen', 'users', 'events']).optional(),
      direction: z.enum(['asc', 'desc']).optional(),
      per_page: perPage,
      next_url: nextUrl
    },
    binding: { aliases: ['list_bugsnag_project_errors', 'bugsnag_list_project_errors'], requiredTerms: ['list', 'project', 'errors'] },
    mapArgs: a => ({ projectId: a.project_id, filters: a.filters, sort: a.sort, direction: a.direction, perPage: a.per_page, nextUrl: a.next_url })
  },
  {
    name: 'bugsnag.error.get',
    purpose: 'Get detailed information for an error including latest occurrence and summaries.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, error_id: id, filters: eqFilter },
    binding: { aliases: ['get_bugsnag_error', 'bugsnag_get_error'], requiredTerms: ['get', 'error'] },
    mapArgs: a => ({ projectId: a.project_id, errorId: a.error_id, filters: a.filters })
  },
  {
    name: 'bugsnag.error.event.list',
    purpose: 'List event occurrences for an error.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, error_id: id, filters: eqFilter, per_page: perPage, next_url: nextUrl },
    binding: { aliases: ['get_bugsnag_events_on_error', 'bugsnag_list_error_events'], requiredTerms: ['events', 'error'] },
    mapArgs: a => ({ projectId: a.project_id, errorId: a.error_id, filters: a.filters, perPage: a.per_page, nextUrl: a.next_url })
  },
  {
    name: 'bugsnag.event.get',
    purpose: 'Get a specific BugSnag event occurrence by event ID.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, event_id: id },
    binding: { aliases: ['get_bugsnag_event_details', 'bugsnag_get_event'], requiredTerms: ['event', 'details'] },
    mapArgs: a => ({ projectId: a.project_id, eventId: a.event_id })
  },
  {
    name: 'bugsnag.project.event_filter.list',
    purpose: 'List valid project event fields usable for error filtering.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId },
    binding: { aliases: ['get_bugsnag_project_event_filters', 'bugsnag_list_project_event_filters'], requiredTerms: ['project', 'event', 'filters'] },
    mapArgs: a => ({ projectId: a.project_id })
  },
  {
    name: 'bugsnag.error.update',
    purpose: 'Update a non-destructive error status or severity override.',
    risk: 'WRITE', approval: 'configurable',
    schema: {
      project_id: projectId,
      error_id: id,
      status: z.enum(['open', 'fixed', 'ignored', 'snoozed']).optional(),
      severity: z.enum(['info', 'warning', 'error']).optional(),
      approved: z.boolean().optional()
    },
    binding: { aliases: ['update_bugsnag_error', 'bugsnag_update_error'], requiredTerms: ['update', 'error'] },
    mapArgs: a => ({ projectId: a.project_id, errorId: a.error_id, status: a.status, severity: a.severity })
  },
  {
    name: 'bugsnag.release.list',
    purpose: 'List releases for a project and release stage.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, release_stage: z.string().min(1).max(64).default('production'), visible_only: z.boolean().optional(), per_page: perPage, next_url: nextUrl },
    binding: { aliases: ['bugsnag_list_releases', 'list_bugsnag_releases'], requiredTerms: ['list', 'releases'] },
    mapArgs: a => ({ projectId: a.project_id, releaseStage: a.release_stage, visibleOnly: a.visible_only, perPage: a.per_page, nextUrl: a.next_url })
  },
  {
    name: 'bugsnag.release.get',
    purpose: 'Get release details including source control metadata and build summary.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, release_id: id },
    binding: { aliases: ['bugsnag_get_release', 'get_bugsnag_release'], requiredTerms: ['get', 'release'] },
    mapArgs: a => ({ projectId: a.project_id, releaseId: a.release_id })
  },
  {
    name: 'bugsnag.build.get',
    purpose: 'Get build details for a project release.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, build_id: id },
    binding: { aliases: ['bugsnag_get_build', 'get_bugsnag_build'], requiredTerms: ['get', 'build'] },
    mapArgs: a => ({ projectId: a.project_id, buildId: a.build_id })
  },
  {
    name: 'bugsnag.performance.span_group.list',
    purpose: 'List performance span groups for a project.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, per_page: perPage, next_url: nextUrl },
    binding: { aliases: ['bugsnag_list_span_groups', 'list_bugsnag_span_groups'], requiredTerms: ['list', 'span', 'groups'] },
    mapArgs: a => ({ projectId: a.project_id, perPage: a.per_page, nextUrl: a.next_url })
  },
  {
    name: 'bugsnag.performance.span_group.get',
    purpose: 'Get detailed metrics for a performance span group.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, span_group_id: id },
    binding: { aliases: ['bugsnag_get_span_group', 'get_bugsnag_span_group'], requiredTerms: ['get', 'span', 'group'] },
    mapArgs: a => ({ projectId: a.project_id, spanGroupId: a.span_group_id })
  },
  {
    name: 'bugsnag.performance.span.list',
    purpose: 'List individual spans within a performance span group.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, span_group_id: id, per_page: perPage, next_url: nextUrl },
    binding: { aliases: ['bugsnag_list_spans', 'list_bugsnag_spans'], requiredTerms: ['list', 'spans'] },
    mapArgs: a => ({ projectId: a.project_id, spanGroupId: a.span_group_id, perPage: a.per_page, nextUrl: a.next_url })
  },
  {
    name: 'bugsnag.performance.trace.get',
    purpose: 'Get the spans in a distributed trace.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId, trace_id: id, per_page: perPage, next_url: nextUrl },
    binding: { aliases: ['bugsnag_get_trace', 'get_bugsnag_trace'], requiredTerms: ['get', 'trace'] },
    mapArgs: a => ({ projectId: a.project_id, traceId: a.trace_id, perPage: a.per_page, nextUrl: a.next_url })
  },
  {
    name: 'bugsnag.performance.trace_field.list',
    purpose: 'List trace fields available for performance filtering.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId },
    binding: { aliases: ['bugsnag_list_trace_fields', 'list_bugsnag_trace_fields'], requiredTerms: ['list', 'trace', 'fields'] },
    mapArgs: a => ({ projectId: a.project_id })
  },
  {
    name: 'bugsnag.performance.network_grouping.get',
    purpose: 'Get network endpoint grouping rules.',
    risk: 'READ', approval: 'none',
    schema: { project_id: projectId },
    binding: { aliases: ['bugsnag_get_network_endpoint_groupings', 'get_bugsnag_network_endpoint_groupings'], requiredTerms: ['get', 'network', 'endpoint', 'groupings'] },
    mapArgs: a => ({ projectId: a.project_id })
  },
  {
    name: 'bugsnag.performance.network_grouping.set',
    purpose: 'Set network endpoint grouping patterns used by BugSnag Performance.',
    risk: 'WRITE', approval: 'configurable',
    schema: {
      project_id: projectId,
      groupings: z.array(z.string().min(1).max(512)).min(1).max(100),
      approved: z.boolean().optional()
    },
    binding: { aliases: ['bugsnag_set_network_endpoint_groupings', 'set_bugsnag_network_endpoint_groupings'], requiredTerms: ['set', 'network', 'endpoint', 'groupings'] },
    mapArgs: a => ({ projectId: a.project_id, groupings: a.groupings })
  }
];

export function sanitizeArgs(args: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined));
}
