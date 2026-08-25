import { z } from 'zod';
import type { CalendlyConfig } from './config.js';
import { CalendlyMcpClient } from './mcp.js';
import { assertApproved, TOOL_POLICY } from './policy.js';
import { CalendlyRestClient } from './rest.js';

const uri = z.string().url().max(500);
const uuid = z.string().min(8).max(500);
const iso = z.string().datetime({ offset: true });
const approval = z.string().length(64).optional();

export type ToolDef = { name: string; description: string; schema: z.ZodObject<any>; upstreamMcp: string; rest: (a: any) => { method: string; path: string; query?: Record<string, any>; body?: unknown; retryable?: boolean } };

export const TOOL_DEFS: ToolDef[] = [
  { name: 'calendly.user.get_current', description: 'Get the authenticated Calendly user.', schema: z.object({}), upstreamMcp: 'users-get_current_user', rest: () => ({ method: 'GET', path: '/users/me' }) },
  { name: 'calendly.event_type.list', description: 'List event types for a user or organization.', schema: z.object({ user: uri.optional(), organization: uri.optional(), count: z.number().int().min(1).max(100).default(20), page_token: z.string().max(500).optional() }), upstreamMcp: 'event_types-list_event_types', rest: a => ({ method: 'GET', path: '/event_types', query: { user: a.user, organization: a.organization, count: a.count, page_token: a.page_token } }) },
  { name: 'calendly.event_type.get', description: 'Get one event type by UUID/URI.', schema: z.object({ uuid }), upstreamMcp: 'event_types-get_event_type', rest: a => ({ method: 'GET', path: `/event_types/${encodeURIComponent(a.uuid)}` }) },
  { name: 'calendly.availability.list_times', description: 'List available start times for an event type in a bounded time range.', schema: z.object({ event_type: uri, start_time: iso, end_time: iso }), upstreamMcp: 'event_types-list_event_type_available_times', rest: a => ({ method: 'GET', path: '/event_type_available_times', query: a }) },
  { name: 'calendly.availability.list_busy_times', description: 'List busy times for a user in a bounded time range.', schema: z.object({ user: uri, start_time: iso, end_time: iso }), upstreamMcp: 'availability-list_user_busy_times', rest: a => ({ method: 'GET', path: '/user_busy_times', query: a }) },
  { name: 'calendly.event.list', description: 'List scheduled events for a user or organization.', schema: z.object({ user: uri.optional(), organization: uri.optional(), min_start_time: iso.optional(), max_start_time: iso.optional(), status: z.enum(['active', 'canceled']).optional(), count: z.number().int().min(1).max(100).default(20), page_token: z.string().max(500).optional() }), upstreamMcp: 'meetings-list_events', rest: a => ({ method: 'GET', path: '/scheduled_events', query: a }) },
  { name: 'calendly.event.get', description: 'Get a scheduled event.', schema: z.object({ uuid }), upstreamMcp: 'meetings-get_event', rest: a => ({ method: 'GET', path: `/scheduled_events/${encodeURIComponent(a.uuid)}` }) },
  { name: 'calendly.invitee.list', description: 'List invitees for a scheduled event.', schema: z.object({ event_uuid: uuid, count: z.number().int().min(1).max(100).default(20), page_token: z.string().max(500).optional() }), upstreamMcp: 'meetings-list_event_invitees', rest: a => ({ method: 'GET', path: `/scheduled_events/${encodeURIComponent(a.event_uuid)}/invitees`, query: { count: a.count, page_token: a.page_token } }) },
  { name: 'calendly.booking.create', description: 'Book an invitee into an event type at a specific start time. Paid-plan Scheduling API capability.', schema: z.object({ event_type: uri, start_time: iso, invitee: z.object({ name: z.string().min(1).max(200), email: z.string().email().max(320), timezone: z.string().min(1).max(100).optional() }), location: z.object({ kind: z.string().min(1).max(100), location: z.string().max(500).optional() }).optional(), approval_id: approval }), upstreamMcp: 'meetings-create_invitee', rest: a => ({ method: 'POST', path: '/invitees', body: withoutApproval(a), retryable: false }) },
  { name: 'calendly.event.cancel', description: 'Cancel a scheduled event. Destructive and requires explicit approval.', schema: z.object({ uuid, reason: z.string().max(1000).optional(), approval_id: approval }), upstreamMcp: 'meetings-cancel_event', rest: a => ({ method: 'POST', path: `/scheduled_events/${encodeURIComponent(a.uuid)}/cancellation`, body: a.reason ? { reason: a.reason } : {}, retryable: false }) },
  { name: 'calendly.scheduling_link.create_single_use', description: 'Create a single-use scheduling link from an existing event type.', schema: z.object({ owner: uri, owner_type: z.literal('EventType'), max_event_count: z.literal(1).default(1), approval_id: approval }), upstreamMcp: 'scheduling_links-create_single_use_scheduling_link', rest: a => ({ method: 'POST', path: '/scheduling_links', body: { owner: a.owner, owner_type: a.owner_type, max_event_count: 1 }, retryable: false }) },
  { name: 'calendly.event_type.create', description: 'Create a Calendly event type.', schema: z.object({ name: z.string().min(1).max(200), host: uri, duration: z.number().int().min(1).max(720), kind: z.enum(['solo', 'group']).optional(), active: z.boolean().optional(), approval_id: approval }), upstreamMcp: 'event_types-create_event_type', rest: a => ({ method: 'POST', path: '/event_types', body: withoutApproval(a), retryable: false }) },
  { name: 'calendly.event_type.update', description: 'Update selected event-type settings.', schema: z.object({ uuid, name: z.string().min(1).max(200).optional(), duration: z.number().int().min(1).max(720).optional(), active: z.boolean().optional(), approval_id: approval }), upstreamMcp: 'event_types-update_event_type', rest: a => ({ method: 'PATCH', path: `/event_types/${encodeURIComponent(a.uuid)}`, body: withoutApproval({ name: a.name, duration: a.duration, active: a.active }), retryable: false }) }
];

export class CalendlyConnector {
  private rest: CalendlyRestClient;
  private mcp: CalendlyMcpClient;
  constructor(private readonly config: CalendlyConfig) { this.rest = new CalendlyRestClient(config); this.mcp = new CalendlyMcpClient(config); }
  async execute(name: string, raw: unknown) {
    const def = TOOL_DEFS.find(t => t.name === name);
    if (!def) throw new Error(`Unknown tool: ${name}`);
    const parsed = def.schema.parse(raw);
    validateCrossFields(name, parsed);
    const { approval_id, ...args } = parsed as Record<string, unknown>;
    assertApproved(this.config, name, args, approval_id as string | undefined);
    const useMcp = this.config.CALENDLY_TRANSPORT === 'mcp' || (this.config.CALENDLY_TRANSPORT === 'auto' && !!this.config.CALENDLY_MCP_ACCESS_TOKEN);
    if (useMcp) return this.mcp.call(def.upstreamMcp, args);
    const r = def.rest(parsed);
    return this.rest.request(r.method, r.path, { query: r.query, body: r.body, retryable: r.retryable });
  }
  policy(name: string) { return TOOL_POLICY[name]; }
}

function validateCrossFields(name: string, a: any) {
  if (name === 'calendly.event_type.list' || name === 'calendly.event.list') if (!!a.user === !!a.organization) throw new Error('Provide exactly one of user or organization');
  if (name === 'calendly.event_type.update' && a.name === undefined && a.duration === undefined && a.active === undefined) throw new Error('At least one mutable field is required');
  if ((name === 'calendly.availability.list_times' || name === 'calendly.availability.list_busy_times') && Date.parse(a.start_time) >= Date.parse(a.end_time)) throw new Error('start_time must be earlier than end_time');
}

function withoutApproval(input: Record<string, unknown>) { return Object.fromEntries(Object.entries(input).filter(([k, v]) => k !== 'approval_id' && v !== undefined)); }
