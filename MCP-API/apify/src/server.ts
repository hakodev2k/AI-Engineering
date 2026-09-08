import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ApifyClient } from './client.js';
import { actorId, jsonObject, offset, pageLimit, recordKey, resourceId } from './config.js';
import { requirePermission, validateWebhookUrl } from './policy.js';

export const TOOL_NAMES = [
  'apify.account.get', 'apify.actor.get', 'apify.actor.runs.list', 'apify.actor.run', 'apify.task.run',
  'apify.run.get', 'apify.run.abort', 'apify.run.log', 'apify.dataset.items.list', 'apify.kv.record.get',
  'apify.webhook.list', 'apify.webhook.create', 'apify.webhook.delete',
] as const;

const approval = z.string().max(64).optional();
const webhookEvents = z.array(z.enum([
  'ACTOR.RUN.SUCCEEDED', 'ACTOR.RUN.FAILED', 'ACTOR.RUN.TIMED_OUT', 'ACTOR.RUN.ABORTED'
])).min(1).max(4);

function result(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ source: 'apify', untrustedData: true, data }) }] };
}
function errorResult(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown connector error';
  return { isError: true, content: [{ type: 'text' as const, text: message.slice(0, 1000) }] };
}

export function createServer(client = new ApifyClient()) {
  const server = new McpServer({ name: 'apify-connector', version: '1.0.0' });
  const safe = (fn: (args: any) => Promise<unknown>) => async (args: any) => {
    try { return result(await fn(args)); } catch (e) { return errorResult(e); }
  };

  server.tool('apify.account.get', 'READ: Get the authenticated Apify account profile. Token never leaves the connector.', {}, safe(async () => client.account()));
  server.tool('apify.actor.get', 'READ: Get Actor metadata, including permission level and defaults.', { actorId }, safe(async ({ actorId }) => client.actor(actorId)));
  server.tool('apify.actor.runs.list', 'READ: List runs for an Actor with bounded pagination.', { actorId, limit: pageLimit, offset, desc: z.boolean().default(true) }, safe(async ({ actorId, limit, offset, desc }) => client.actorRuns(actorId, limit, offset, desc)));

  server.tool('apify.actor.run', 'HIGH_RISK: Start an Actor run. May incur usage charges and cause external web activity. Full-permission Actors are refused.', { actorId, input: jsonObject, approval }, safe(async ({ actorId, input, approval }) => {
    requirePermission('apify.actor.run', 'HIGH_RISK', approval);
    const meta = await client.actor(actorId) as any;
    if (meta?.data?.actorPermissionLevel === 'FULL_PERMISSIONS') throw new Error('Full-permission Actors are blocked; run them manually in Apify Console');
    return client.runActor(actorId, input);
  }));

  server.tool('apify.task.run', 'HIGH_RISK: Start an existing Actor task with optional input overrides. The referenced Actor is checked for full permissions.', { taskId: resourceId, input: jsonObject, approval }, safe(async ({ taskId, input, approval }) => {
    requirePermission('apify.task.run', 'HIGH_RISK', approval);
    const task = await client.task(taskId) as any;
    const actId = task?.data?.actId;
    if (typeof actId !== 'string' || !actId) throw new Error('Task response did not contain a valid Actor ID');
    const meta = await client.actor(actId) as any;
    if (meta?.data?.actorPermissionLevel === 'FULL_PERMISSIONS') throw new Error('Tasks backed by full-permission Actors are blocked; run them manually in Apify Console');
    return client.runTask(taskId, input);
  }));

  server.tool('apify.run.get', 'READ: Get current status, timings, storages and metadata for an Actor run.', { runId: resourceId }, safe(async ({ runId }) => client.run(runId)));
  server.tool('apify.run.abort', 'HIGH_RISK: Abort a running Actor execution. Requires explicit human approval.', { runId: resourceId, approval }, safe(async ({ runId, approval }) => { requirePermission('apify.run.abort', 'HIGH_RISK', approval); return client.abortRun(runId); }));
  server.tool('apify.run.log', 'READ: Read the retained trailing log for a run/build. Output is truncated to 200,000 characters.', { runId: resourceId }, safe(async ({ runId }) => { const text = await client.runLog(runId); return { truncated: text.length > 200000, text: text.slice(-200000) }; }));
  server.tool('apify.dataset.items.list', 'READ: Retrieve a bounded page of dataset items.', { datasetId: resourceId, limit: z.number().int().min(1).max(500).default(100), offset, clean: z.boolean().default(true) }, safe(async ({ datasetId, limit, offset, clean }) => client.datasetItems(datasetId, limit, offset, clean)));
  server.tool('apify.kv.record.get', 'READ: Retrieve a single key-value store record for JSON/text agent workflows.', { storeId: resourceId, key: recordKey }, safe(async ({ storeId, key }) => client.kvRecord(storeId, key)));
  server.tool('apify.webhook.list', 'READ: List account webhooks with bounded pagination.', { limit: pageLimit, offset, desc: z.boolean().default(true) }, safe(async ({ limit, offset, desc }) => client.webhooks(limit, offset, desc)));

  server.tool('apify.webhook.create', 'HIGH_RISK: Create an HTTPS webhook for run lifecycle events. Private/local target addresses are blocked.', {
    requestUrl: z.string().url().max(2048), eventTypes: webhookEvents, actorId: actorId.optional(), taskId: resourceId.optional(), payloadTemplate: z.string().max(20000).optional(), idempotencyKey: z.string().uuid(), approval,
  }, safe(async ({ requestUrl, eventTypes, actorId, taskId, payloadTemplate, idempotencyKey, approval }) => {
    requirePermission('apify.webhook.create', 'HIGH_RISK', approval);
    validateWebhookUrl(requestUrl);
    if (!!actorId === !!taskId) throw new Error('Exactly one of actorId or taskId is required');
    const condition = actorId ? { actorId } : { actorTaskId: taskId };
    return client.createWebhook({ requestUrl, eventTypes, condition, ...(payloadTemplate ? { payloadTemplate } : {}), idempotencyKey });
  }));

  server.tool('apify.webhook.delete', 'DESTRUCTIVE: Permanently delete a webhook. Disabled by default and requires strong approval.', { webhookId: resourceId, approval }, safe(async ({ webhookId, approval }) => {
    requirePermission('apify.webhook.delete', 'DESTRUCTIVE', approval);
    await client.deleteWebhook(webhookId);
    return { deleted: true, webhookId };
  }));

  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}
