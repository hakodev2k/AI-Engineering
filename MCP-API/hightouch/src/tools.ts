import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { HightouchClient, HightouchError, wrapProviderData } from './client.js';
import { idSchema, runLimitSchema } from './config.js';
import { assertAllowed } from './policy.js';

function output(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(wrapProviderData(value)) }] };
}

function failure(error: unknown) {
  if (error instanceof HightouchError) {
    return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: error.message, status: error.status, retryAfterMs: error.retryAfterMs }) }] };
  }
  return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected connector error' }) }] };
}

export function registerTools(server: McpServer, client: HightouchClient): void {
  server.tool('hightouch.sync.list', 'List Hightouch syncs visible to the API key. READ.', {}, async () => {
    try { assertAllowed('hightouch.sync.list'); return output(await client.listSyncs()); } catch (e) { return failure(e); }
  });
  server.tool('hightouch.sync.get', 'Get one Hightouch sync by ID. READ.', { id: idSchema }, async ({ id }) => {
    try { assertAllowed('hightouch.sync.get'); return output(await client.getSync(id)); } catch (e) { return failure(e); }
  });
  server.tool('hightouch.sync.run.list', 'List execution runs for a Hightouch sync. READ.', { syncId: idSchema, limit: runLimitSchema }, async ({ syncId, limit }) => {
    try { assertAllowed('hightouch.sync.run.list'); return output(await client.listSyncRuns(syncId, limit)); } catch (e) { return failure(e); }
  });
  server.tool(
    'hightouch.sync.trigger',
    'Trigger a Hightouch sync execution. HIGH_RISK: may activate data in an external destination; requires operator enablement and explicit per-call human approval.',
    { syncId: idSchema, approvalToken: z.literal('APPROVE_SYNC_TRIGGER') },
    async ({ syncId, approvalToken }) => {
      try { assertAllowed('hightouch.sync.trigger', approvalToken === 'APPROVE_SYNC_TRIGGER'); return output(await client.triggerSync(syncId)); } catch (e) { return failure(e); }
    },
  );
  server.tool('hightouch.model.list', 'List Hightouch models. READ.', {}, async () => {
    try { assertAllowed('hightouch.model.list'); return output(await client.listModels()); } catch (e) { return failure(e); }
  });
  server.tool('hightouch.model.get', 'Get one Hightouch model by ID. READ.', { id: idSchema }, async ({ id }) => {
    try { assertAllowed('hightouch.model.get'); return output(await client.getModel(id)); } catch (e) { return failure(e); }
  });
  server.tool('hightouch.source.list', 'List Hightouch sources. READ.', {}, async () => {
    try { assertAllowed('hightouch.source.list'); return output(await client.listSources()); } catch (e) { return failure(e); }
  });
  server.tool('hightouch.source.get', 'Get one Hightouch source by ID. READ.', { id: idSchema }, async ({ id }) => {
    try { assertAllowed('hightouch.source.get'); return output(await client.getSource(id)); } catch (e) { return failure(e); }
  });
  server.tool('hightouch.destination.list', 'List Hightouch destinations. READ.', {}, async () => {
    try { assertAllowed('hightouch.destination.list'); return output(await client.listDestinations()); } catch (e) { return failure(e); }
  });
  server.tool('hightouch.destination.get', 'Get one Hightouch destination by ID. READ.', { id: idSchema }, async ({ id }) => {
    try { assertAllowed('hightouch.destination.get'); return output(await client.getDestination(id)); } catch (e) { return failure(e); }
  });
}
