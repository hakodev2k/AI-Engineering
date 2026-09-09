import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { ChecklyClient } from './client.js';
import { ChecklyMcpClient } from './upstream-mcp.js';
import { authorize, safeSegment, type Risk } from './policy.js';

const cfg = loadConfig();
const api = new ChecklyClient(cfg);
const upstream = new ChecklyMcpClient(cfg);
const server = new McpServer({name: 'checkly-connector', version: '1.0.0'});
const id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const page = {limit: z.number().int().min(1).max(100).optional(), page: z.number().int().min(1).optional()};

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (/^(rawKey|token|apiKey|authorization|password|secret|secretValue)$/i.test(key)) out[key] = '[REDACTED]';
    else if (key === 'proxyUrl' && typeof raw === 'string') {
      try { const u = new URL(raw); u.username = ''; u.password = ''; out[key] = u.toString(); } catch { out[key] = '[REDACTED]'; }
    } else out[key] = redact(raw);
  }
  return out;
}

function ok(result: unknown, transport: 'mcp' | 'rest') {
  return {content: [{type: 'text' as const, text: JSON.stringify({provider: 'checkly', transport, untrusted_data: true, result: redact(result)}, null, 2)}]};
}

async function mcpRead(tool: 'list-check-stats' | 'list-check-results' | 'get-check-result', args: Record<string, unknown>, rest: () => Promise<unknown>) {
  if (cfg.mcpEnabled) {
    try { return ok(await upstream.call(tool, args), 'mcp'); } catch { /* safe read-only REST fallback */ }
  }
  return ok(await rest(), 'rest');
}

function reg(name: string, purpose: string, risk: Risk, schema: Record<string, z.ZodTypeAny>, run: (args: any) => Promise<ReturnType<typeof ok>>) {
  server.registerTool(name, {
    description: `${purpose} Risk=${risk}. Required permission: Checkly account access. ${risk === 'READ' ? 'No connector approval required.' : 'Explicit human approval is required before execution.'}`,
    inputSchema: schema
  }, async (args: any) => {
    try {
      authorize(risk, args.approved, cfg.requireWriteApproval);
      return await run(args);
    } catch (error) {
      return {isError: true, content: [{type: 'text' as const, text: error instanceof Error ? error.message : 'Unknown Checkly connector error'}]};
    }
  });
}

const checkType = z.enum(['API','BROWSER','HEARTBEAT','ICMP','MULTI_STEP','TCP','PLAYWRIGHT','URL','DNS']);
reg('checkly.check.list', 'List checks with bounded filters and current monitoring context.', 'READ', {
  ...page,
  tag: z.array(z.string().min(1).max(100)).max(20).optional(),
  check_type: checkType.optional(),
  search: z.string().min(1).max(200).optional(),
  status: z.enum(['passing','failing','degraded']).optional(),
  include_reliability: z.boolean().optional()
}, async a => mcpRead('list-check-stats', {limit:a.limit,page:a.page,tag:a.tag,checkType:a.check_type,search:a.search,status:a.status,includeReliability:a.include_reliability}, () => api.request('GET','/v1/checks',undefined,{limit:a.limit,page:a.page,tag:a.tag})));

reg('checkly.check.get', 'Read one deployed check definition.', 'READ', {check_id:id}, async a => ok(await api.request('GET',`/v1/checks/${safeSegment(a.check_id,'check_id')}`),'rest'));
reg('checkly.check_status.list', 'Read current status records for account checks.', 'READ', {}, async () => ok(await api.request('GET','/v1/check-statuses'),'rest'));

reg('checkly.check_result.list', 'List recent compact results for a specific check.', 'READ', {check_id:id,...page}, async a => mcpRead('list-check-results', {checkId:a.check_id,limit:a.limit,page:a.page}, () => api.request('GET',`/v1/check-results/${safeSegment(a.check_id,'check_id')}`,undefined,{limit:a.limit,page:a.page})));
reg('checkly.check_result.get', 'Read one specific check result.', 'READ', {check_id:id,result_id:id}, async a => mcpRead('get-check-result', {checkId:a.check_id,resultId:a.result_id}, () => api.request('GET',`/v1/check-results/${safeSegment(a.check_id,'check_id')}/${safeSegment(a.result_id,'result_id')}`)));
reg('checkly.error_group.list', 'List error groups observed for a specific check.', 'READ', {check_id:id,...page}, async a => ok(await api.request('GET',`/v1/error-groups/checks/${safeSegment(a.check_id,'check_id')}`,undefined,{limit:a.limit,page:a.page}),'rest'));

reg('checkly.alert_notification.list', 'List alert notification records in a bounded time window.', 'READ', {
  ...page,
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional()
}, async a => ok(await api.request('GET','/v1/alert-notifications',undefined,{limit:a.limit,page:a.page,from:a.from,to:a.to}),'rest'));

reg('checkly.status_page.list', 'List status pages and their service metadata.', 'READ', {
  limit:z.number().int().min(1).max(100).optional(),
  next_id:z.string().min(1).max(256).optional()
}, async a => ok(await api.request('GET','/v1/status-pages',undefined,{limit:a.limit,nextId:a.next_id}),'rest'));

reg('checkly.private_location.list', 'List configured private monitoring locations; credential-like fields are redacted.', 'READ', {versions:z.boolean().optional()}, async a => ok(await api.request('GET','/v1/private-locations',undefined,{versions:a.versions}),'rest'));
reg('checkly.private_location.metrics', 'Read bounded health metrics for a private monitoring location.', 'READ', {
  private_location_id:id,
  from:z.string().datetime().optional(),
  to:z.string().datetime().optional()
}, async a => ok(await api.request('GET',`/v1/private-locations/${safeSegment(a.private_location_id,'private_location_id')}/metrics`,undefined,{from:a.from,to:a.to}),'rest'));

reg('checkly.check_session.trigger', 'Trigger already-deployed checks. This can consume execution quota and standard alerting rules may notify external recipients.', 'HIGH_RISK', {
  check_ids:z.array(id).min(1).max(50).optional(),
  match_tags:z.array(z.array(z.string().min(1).max(100)).min(1).max(20)).min(1).max(20).optional(),
  refresh_cache:z.boolean().optional(),
  approved:z.boolean().optional()
}, async a => {
  if (!a.check_ids && !a.match_tags) throw new Error('At least one check_ids or match_tags selector is required; triggering every eligible check is blocked');
  const target: Record<string, unknown> = {};
  if (a.check_ids) target.checkId = a.check_ids;
  if (a.match_tags) target.matchTags = a.match_tags;
  return ok(await api.request('POST','/v2/check-sessions/trigger',{target,refreshCache:a.refresh_cache ?? false}),'rest');
});

reg('checkly.check_session.get', 'Read one Checkly check session.', 'READ', {check_session_id:id}, async a => ok(await api.request('GET',`/v2/check-sessions/${safeSegment(a.check_session_id,'check_session_id')}`),'rest'));
reg('checkly.check_session.completion', 'Read completion state for a Checkly check session.', 'READ', {check_session_id:id}, async a => ok(await api.request('GET',`/v2/check-sessions/${safeSegment(a.check_session_id,'check_session_id')}/completion`),'rest'));

await server.connect(new StdioServerTransport());
