import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Config } from './config.js';
import { CronitorClient } from './client.js';
import { assertAllowed, encodePath, type Risk } from './policy.js';

const approved = z.boolean().optional().describe('Explicit human approval for write/high-risk/destructive operations.');
const monitorType = z.enum(['job', 'heartbeat', 'check', 'site']);
const issueSeverity = z.enum(['missing_data', 'operational', 'maintenance', 'degraded_performance', 'minor_outage', 'outage']);
const issueState = z.enum(['unresolved', 'investigating', 'identified', 'monitoring', 'resolved', 'update']);

function output(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ data: value, untrusted_provider_content: true }, null, 2) }] };
}

function query(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) for (const item of v) q.append(k, String(item));
    else q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

function register<T extends z.ZodRawShape>(server: McpServer, name: string, description: string, risk: Risk, schema: T, config: Config, handler: (input: z.infer<z.ZodObject<T>>) => Promise<unknown>) {
  server.registerTool(name, { description: `${description} Risk=${risk}.`, inputSchema: schema }, async input => {
    assertAllowed(config, risk, (input as { approved?: boolean }).approved);
    return output(await handler(input));
  });
}

export function registerCronitorTools(server: McpServer, client: CronitorClient, config: Config): void {
  register(server, 'cronitor.monitor.list', 'List/search monitors with bounded filters.', 'READ', {
    type: z.array(monitorType).max(4).optional(), group: z.string().max(100).optional(), tag: z.array(z.string().max(100)).max(20).optional(), state: z.array(z.string().max(50)).max(10).optional(), search: z.string().max(200).optional()
  }, config, async i => client.request(`/monitors${query(i)}`));

  register(server, 'cronitor.monitor.get', 'Get one monitor with optional recent events/invocations.', 'READ', {
    key: z.string().min(1).max(200), withEvents: z.boolean().optional(), withInvocations: z.boolean().optional()
  }, config, async i => client.request(`/monitors/${encodePath(i.key)}${query({ withEvents: i.withEvents, withInvocations: i.withInvocations })}`));

  const monitorBody = {
    key: z.string().regex(/^[A-Za-z0-9_.:-]{1,200}$/), type: monitorType, name: z.string().max(200).optional(), schedules: z.array(z.string().min(1).max(200)).max(20).optional(), assertions: z.array(z.string().min(1).max(500)).max(50).optional(), notify: z.array(z.string().min(1).max(200)).max(30).optional(), timezone: z.string().max(100).optional(), group: z.string().max(100).optional(), tags: z.array(z.string().max(100)).max(50).optional(), note: z.string().max(5000).optional(), request: z.object({ url: z.string().url(), method: z.enum(['GET','HEAD','PATCH','POST','PUT']).optional(), body: z.string().max(20000).optional(), headers: z.record(z.string().max(5120)).optional(), timeout_seconds: z.number().int().min(1).max(15).optional(), follow_redirects: z.boolean().optional(), verify_ssl: z.boolean().optional() }).strict().optional(), approved
  };

  register(server, 'cronitor.monitor.create', 'Create one monitor using the current dated API.', 'WRITE', monitorBody, config, async i => {
    const { approved: _a, ...body } = i; return client.request('/monitors', { method: 'POST', body: JSON.stringify(body) }, false);
  });

  register(server, 'cronitor.monitor.update', 'Update an existing monitor by key.', 'WRITE', {
    key: z.string().min(1).max(200), name: z.string().max(200).optional(), schedules: z.array(z.string().min(1).max(200)).max(20).optional(), assertions: z.array(z.string().min(1).max(500)).max(50).optional(), notify: z.array(z.string().min(1).max(200)).max(30).optional(), timezone: z.string().max(100).optional(), group: z.string().max(100).optional(), tags: z.array(z.string().max(100)).max(50).optional(), note: z.string().max(5000).optional(), approved
  }, config, async i => {
    const { key, approved: _a, ...body } = i; return client.request('/monitors', { method: 'PUT', body: JSON.stringify({ monitors: [{ key, ...body }] }) }, false);
  });

  register(server, 'cronitor.monitor.pause', 'Pause or resume monitoring/alerting.', 'WRITE', {
    key: z.string().min(1).max(200), paused: z.boolean(), approved
  }, config, async i => client.request('/monitors', { method: 'PUT', body: JSON.stringify({ monitors: [{ key: i.key, paused: i.paused }] }) }, false));

  register(server, 'cronitor.monitor.delete', 'Permanently delete a monitor.', 'DESTRUCTIVE', {
    key: z.string().min(1).max(200), approved
  }, config, async i => client.request(`/monitors/${encodePath(i.key)}`, { method: 'DELETE' }, false));

  register(server, 'cronitor.issue.list', 'List/search issues with pagination and filters.', 'READ', {
    state: z.array(issueState).max(10).optional(), severity: z.array(issueSeverity).max(10).optional(), statuspage: z.string().max(200).optional(), search: z.string().max(200).optional(), time: z.string().max(50).optional(), page: z.number().int().min(1).max(10000).optional()
  }, config, async i => client.request(`/issues${query(i)}`));

  register(server, 'cronitor.issue.get', 'Get one issue.', 'READ', { key: z.string().min(1).max(200) }, config, async i => client.request(`/issues/${encodePath(i.key)}`));

  register(server, 'cronitor.issue.create', 'Create an issue; attaching status pages can publish customer-facing incident information.', 'HIGH_RISK', {
    name: z.string().min(1).max(300), severity: issueSeverity.optional(), state: issueState.optional(), assigned_to: z.string().email().optional(), statuspages: z.array(z.string().max(200)).max(20).optional(), affected_components: z.array(z.string().max(200)).max(100).optional(), approved
  }, config, async i => { const { approved: _a, ...body } = i; return client.request('/issues', { method: 'POST', body: JSON.stringify(body) }, false); });

  register(server, 'cronitor.issue.update', 'Update issue lifecycle or publish an update.', 'HIGH_RISK', {
    key: z.string().min(1).max(200), name: z.string().max(300).optional(), severity: issueSeverity.optional(), state: issueState.optional(), assigned_to: z.string().email().optional(), statuspages: z.array(z.string().max(200)).max(20).optional(), affected_components: z.array(z.string().max(200)).max(100).optional(), message: z.string().max(5000).optional(), approved
  }, config, async i => {
    const { key, approved: _a, message, ...body } = i;
    const payload = message ? { ...body, updates: [{ message, state: body.state ?? 'update' }] } : body;
    return client.request(`/issues/${encodePath(key)}`, { method: 'PUT', body: JSON.stringify(payload) }, false);
  });

  register(server, 'cronitor.issue.delete', 'Permanently delete an issue.', 'DESTRUCTIVE', { key: z.string().min(1).max(200), approved }, config, async i => client.request(`/issues/${encodePath(i.key)}`, { method: 'DELETE' }, false));

  register(server, 'cronitor.statuspage.list', 'List status pages and optionally include status/components.', 'READ', {
    withStatus: z.boolean().optional(), withComponents: z.boolean().optional()
  }, config, async i => client.request(`/statuspages${query(i)}`));

  register(server, 'cronitor.statuspage.get', 'Get one status page.', 'READ', {
    key: z.string().min(1).max(200), withStatus: z.boolean().optional(), withComponents: z.boolean().optional()
  }, config, async i => client.request(`/statuspages/${encodePath(i.key)}${query({ withStatus: i.withStatus, withComponents: i.withComponents })}`));

  const statusPageFields = {
    name: z.string().min(1).max(200), hosted_subdomain: z.string().regex(/^[a-z0-9-]{1,63}$/).optional(), website_url: z.string().url().optional(), support_url: z.string().url().optional(), custom_domain: z.string().max(253).optional(), access: z.enum(['public','private','password_protected','ip_restricted']).optional(), environment: z.string().max(100).optional(), allow_search_index: z.boolean().optional(), enable_performance_metrics: z.boolean().optional(), approved
  };

  register(server, 'cronitor.statuspage.create', 'Create a status page. This may expose service status publicly depending on access.', 'HIGH_RISK', statusPageFields, config, async i => { const { approved: _a, ...body } = i; return client.request('/statuspages', { method: 'POST', body: JSON.stringify(body) }, false); });

  register(server, 'cronitor.statuspage.update', 'Change status page metadata/access settings.', 'HIGH_RISK', {
    key: z.string().min(1).max(200), name: z.string().max(200).optional(), website_url: z.string().url().optional(), support_url: z.string().url().optional(), custom_domain: z.string().max(253).optional(), access: z.enum(['public','private','password_protected','ip_restricted']).optional(), allow_search_index: z.boolean().optional(), enable_performance_metrics: z.boolean().optional(), approved
  }, config, async i => { const { key, approved: _a, ...body } = i; return client.request(`/statuspages/${encodePath(key)}`, { method: 'PUT', body: JSON.stringify(body) }, false); });

  register(server, 'cronitor.statuspage.delete', 'Delete a status page.', 'DESTRUCTIVE', { key: z.string().min(1).max(200), approved }, config, async i => client.request(`/statuspages/${encodePath(i.key)}`, { method: 'DELETE' }, false));

  register(server, 'cronitor.telemetry.send', 'Send a bounded lifecycle telemetry event for a configured monitor.', 'WRITE', {
    monitorKey: z.string().regex(/^[A-Za-z0-9_.:-]{1,200}$/), state: z.enum(['run','complete','fail','ok']), message: z.string().max(1000).optional(), approved
  }, config, async i => client.sendTelemetry(i.monitorKey, i.state, i.message));
}
