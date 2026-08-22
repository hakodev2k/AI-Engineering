import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PagerDutyClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new PagerDutyClient(config);
const server = new McpServer({ name: 'pagerduty-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Id = z.string().min(1).max(64).regex(/^[A-Za-z0-9]+$/);

server.tool('pagerduty.incident.list', 'List incidents with bounded pagination. READ.', {
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).max(100000).default(0),
  statuses: z.array(z.enum(['triggered','acknowledged','resolved'])).max(3).optional(),
  service_ids: z.array(Id).max(25).optional(),
  urgencies: z.array(z.enum(['high','low'])).max(2).optional(),
  since: z.string().datetime().optional(),
  until: z.string().datetime().optional(),
  sort_by: z.enum(['incident_number:asc','incident_number:desc','created_at:asc','created_at:desc','resolved_at:asc','resolved_at:desc','urgency:asc','urgency:desc']).optional()
}, async ({ limit, offset, statuses, service_ids, urgencies, since, until, sort_by }) => json(await client.request('/incidents', { query: {
  limit, offset, statuses: statuses?.join(','), service_ids: service_ids?.join(','), urgencies: urgencies?.join(','), since, until, sort_by
} })));

server.tool('pagerduty.incident.get', 'Get one incident. READ.', { incident_id: Id },
  async ({ incident_id }) => json(await client.request(`/incidents/${incident_id}`)));

async function updateIncident(incident_id: string, status: 'acknowledged'|'resolved', action: string) {
  assertWriteAllowed(config, action);
  return json(await client.request(`/incidents/${incident_id}`, { method: 'PUT', requireFrom: true, body: { incident: { type: 'incident_reference', status } } }));
}
server.tool('pagerduty.incident.acknowledge', 'Acknowledge an incident. HIGH_RISK WRITE; explicit operator approval required.', { incident_id: Id },
  async ({ incident_id }) => updateIncident(incident_id, 'acknowledged', 'pagerduty.incident.acknowledge'));
server.tool('pagerduty.incident.resolve', 'Resolve an incident. HIGH_RISK WRITE; explicit operator approval required.', { incident_id: Id },
  async ({ incident_id }) => updateIncident(incident_id, 'resolved', 'pagerduty.incident.resolve'));
server.tool('pagerduty.incident.reassign', 'Reassign an incident to one or more assignees. HIGH_RISK WRITE; explicit operator approval required.', {
  incident_id: Id,
  assignee_ids: z.array(Id).min(1).max(20)
}, async ({ incident_id, assignee_ids }) => {
  assertWriteAllowed(config, 'pagerduty.incident.reassign');
  return json(await client.request(`/incidents/${incident_id}`, { method: 'PUT', requireFrom: true, body: { incident: { type: 'incident_reference', assignments: assignee_ids.map(id => ({ assignee: { id, type: 'user_reference' } })) } } }));
});

server.tool('pagerduty.service.list', 'List services. READ.', {
  limit: z.number().int().min(1).max(100).default(25), offset: z.number().int().min(0).max(100000).default(0), query: z.string().max(200).optional()
}, async (args) => json(await client.request('/services', { query: args })));
server.tool('pagerduty.service.get', 'Get one service. READ.', { service_id: Id },
  async ({ service_id }) => json(await client.request(`/services/${service_id}`)));

server.tool('pagerduty.schedule.list', 'List schedules. READ.', {
  limit: z.number().int().min(1).max(100).default(25), offset: z.number().int().min(0).max(100000).default(0), query: z.string().max(200).optional()
}, async (args) => json(await client.request('/schedules', { query: args })));
server.tool('pagerduty.schedule.get', 'Get one schedule and optional rendered time window. READ.', {
  schedule_id: Id, since: z.string().datetime().optional(), until: z.string().datetime().optional(), time_zone: z.string().max(100).optional()
}, async ({ schedule_id, ...query }) => json(await client.request(`/schedules/${schedule_id}`, { query })));

server.tool('pagerduty.oncall.list', 'List current or historical on-call entries. READ.', {
  limit: z.number().int().min(1).max(100).default(25), offset: z.number().int().min(0).max(100000).default(0),
  schedule_ids: z.array(Id).max(25).optional(), user_ids: z.array(Id).max(25).optional(), escalation_policy_ids: z.array(Id).max(25).optional(),
  since: z.string().datetime().optional(), until: z.string().datetime().optional()
}, async ({ limit, offset, schedule_ids, user_ids, escalation_policy_ids, since, until }) => json(await client.request('/oncalls', { query: {
  limit, offset, schedule_ids: schedule_ids?.join(','), user_ids: user_ids?.join(','), escalation_policy_ids: escalation_policy_ids?.join(','), since, until
} })));

server.tool('pagerduty.escalation_policy.list', 'List escalation policies. READ.', {
  limit: z.number().int().min(1).max(100).default(25), offset: z.number().int().min(0).max(100000).default(0), query: z.string().max(200).optional()
}, async (args) => json(await client.request('/escalation_policies', { query: args })));
server.tool('pagerduty.user.list', 'List PagerDuty users. READ.', {
  limit: z.number().int().min(1).max(100).default(25), offset: z.number().int().min(0).max(100000).default(0), query: z.string().max(200).optional()
}, async (args) => json(await client.request('/users', { query: args })));

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
