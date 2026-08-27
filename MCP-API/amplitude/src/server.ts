import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { AmplitudeClient } from './client.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new AmplitudeClient(config);
const server = new McpServer({ name: 'amplitude-mcp-connector', version: '1.0.0' });
const date = z.string().regex(/^\d{8}$/, 'Expected YYYYMMDD');
const event = z.object({ event_type: z.string().min(1).max(1024) }).passthrough();
const segment = z.array(z.record(z.string(), z.unknown())).max(20).optional();
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const json = (value: unknown) => JSON.stringify(value);

server.tool('amplitude.event.list', 'List visible event types with current-week totals and uniques. READ.', {}, async () => out(await client.dashboard('/api/2/events/list')));

server.tool('amplitude.user.count', 'Get active/new user counts for a date range. READ.', {
  start: date, end: date, m: z.enum(['active', 'new']).optional(), i: z.enum(['1', '7', '30']).optional()
}, async a => out(await client.dashboard('/api/2/users', a)));

server.tool('amplitude.event.segment', 'Analyze an event over time with optional metric, segment, and grouping. READ.', {
  event, secondEvent: event.optional(), start: date, end: date,
  metric: z.enum(['uniques', 'totals', 'pct_dau', 'average', 'histogram', 'sums', 'value_avg', 'formula']).optional(),
  interval: z.enum(['-300000', '-3600000', '1', '7', '30']).optional(),
  userType: z.enum(['any', 'active']).optional(), groupBy: z.string().max(256).optional(), secondGroupBy: z.string().max(256).optional(), segment
}, async a => out(await client.dashboard('/api/2/events/segmentation', {
  e: json(a.event), e2: a.secondEvent ? json(a.secondEvent) : undefined, start: a.start, end: a.end, m: a.metric, i: a.interval,
  n: a.userType, g: a.groupBy, g2: a.secondGroupBy, s: a.segment ? json(a.segment) : undefined
})));

server.tool('amplitude.funnel.analyze', 'Analyze 2-10 funnel steps for a date range. READ.', {
  events: z.array(event).min(2).max(10), start: date, end: date, mode: z.enum(['ordered', 'unordered', 'sequential']).optional(),
  userType: z.enum(['new', 'active']).optional(), interval: z.enum(['-300000', '-3600000', '1', '7', '30']).optional(), groupBy: z.string().max(256).optional(), segment
}, async a => out(await client.dashboard('/api/2/funnels', {
  e: a.events.map(json), start: a.start, end: a.end, mode: a.mode, n: a.userType, i: a.interval, g: a.groupBy, s: a.segment ? json(a.segment) : undefined
})));

server.tool('amplitude.retention.analyze', 'Analyze retention between a start and return action. READ.', {
  startEvent: event, returnEvent: event, start: date, end: date, retentionMode: z.enum(['bracket', 'rolling', 'n-day']).optional(),
  brackets: z.array(z.tuple([z.number().int().min(0), z.number().int().positive()])).max(20).optional(), interval: z.enum(['1', '7', '30']).optional(),
  groupBy: z.string().max(256).optional(), segment
}, async a => out(await client.dashboard('/api/2/retention', {
  se: json(a.startEvent), re: json(a.returnEvent), start: a.start, end: a.end, rm: a.retentionMode,
  rb: a.brackets ? json(a.brackets) : undefined, i: a.interval, g: a.groupBy, s: a.segment ? json(a.segment) : undefined
})));

server.tool('amplitude.chart.get', 'Get results for an existing saved chart by chart ID. READ.', {
  chartId: z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/)
}, async a => out(await client.dashboard(`/api/3/chart/${encodeURIComponent(a.chartId)}/csv`)));

server.tool('amplitude.user.activity', 'Get a user summary and recent/earliest events by Amplitude ID. READ.', {
  amplitudeId: z.union([z.string().min(1).max(128), z.number().int().nonnegative()]), offset: z.number().int().min(0).max(1000000).optional(),
  limit: z.number().int().min(1).max(1000).optional(), direction: z.enum(['earliest', 'latest']).optional()
}, async a => out(await client.dashboard('/api/2/useractivity', { user: String(a.amplitudeId), offset: a.offset, limit: a.limit, direction: a.direction })));

server.tool('amplitude.user.profile', 'Get server-side user properties, cohort IDs, or computations. READ. Unsupported for EU residency.', {
  userId: z.string().min(1).max(1024).optional(), deviceId: z.string().min(1).max(1024).optional(),
  getAmpProps: z.boolean().optional(), getCohortIds: z.boolean().optional(), getComputations: z.boolean().optional(), compId: z.string().max(2048).optional()
}, async a => {
  if (!a.userId && !a.deviceId) throw new Error('userId or deviceId is required');
  return out(await client.profile({ user_id: a.userId, device_id: a.deviceId, get_amp_props: a.getAmpProps, get_cohort_ids: a.getCohortIds, get_computations: a.getComputations, comp_id: a.compId }));
});

const ingestEvent = z.object({
  event_type: z.string().min(1).max(1024), user_id: z.string().min(1).max(1024).optional(), device_id: z.string().min(1).max(1024).optional(),
  time: z.number().int().nonnegative().optional(), event_properties: z.record(z.string(), z.unknown()).optional(), user_properties: z.record(z.string(), z.unknown()).optional(),
  groups: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(), session_id: z.number().int().optional(), insert_id: z.string().max(1024).optional()
}).refine(v => Boolean(v.user_id || v.device_id), { message: 'Each event requires user_id or device_id' });

server.tool('amplitude.event.ingest', 'Ingest up to 100 analytics events through HTTP V2. WRITE; explicit approval required. Not retried automatically.', {
  events: z.array(ingestEvent).min(1).max(100), options: z.record(z.string(), z.unknown()).optional(), approvalId
}, async a => {
  assertApproval('amplitude.event.ingest', a.approvalId, config.approvalSecret);
  return out(await client.ingest(a.events, a.options));
});

const shutdown = () => { void server.close().finally(() => process.exit(0)); };
process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
