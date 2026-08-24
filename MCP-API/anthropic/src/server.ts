import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { AnthropicClient } from './client.js';
import { assertModelAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new AnthropicClient(config);
const server = new McpServer({ name: 'anthropic-mcp-connector', version: '1.0.0' });
const approvalId = z.string().length(64).optional();
const cursor = z.string().max(500).optional();
const limit = z.number().int().min(1).max(1000).optional();
const model = z.string().min(1).max(200);
const role = z.enum(['user', 'assistant']);
const content = z.string().min(1).max(500000);
const message = z.object({ role, content });
const messages = z.array(message).min(1).max(1000);
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value) }] });
const enc = encodeURIComponent;

server.tool('anthropic.model.list', 'List Anthropic models available to the API key. READ.', {
  limit, beforeId: cursor, afterId: cursor
}, async a => out(await client.get('/v1/models', { limit: a.limit, before_id: a.beforeId, after_id: a.afterId })));

server.tool('anthropic.model.get', 'Get metadata for one Anthropic model. READ.', { modelId: model }, async a => {
  assertModelAllowed(config, a.modelId);
  return out(await client.get(`/v1/models/${enc(a.modelId)}`));
});

server.tool('anthropic.message.count_tokens', 'Count input tokens for a proposed Messages API request without generating output. READ.', {
  model,
  messages,
  system: z.string().max(200000).optional()
}, async a => {
  assertModelAllowed(config, a.model);
  return out(await client.post('/v1/messages/count_tokens', { model: a.model, messages: a.messages, system: a.system }));
});

server.tool('anthropic.message.create', 'Create a Claude message. WRITE because it incurs inference usage; explicit approval required.', {
  model,
  messages,
  maxTokens: z.number().int().min(1).max(config.maxOutputTokens),
  system: z.string().max(200000).optional(),
  temperature: z.number().min(0).max(1).optional(),
  stopSequences: z.array(z.string().min(1).max(1000)).max(20).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  assertApproval('anthropic.message.create', a.approvalId, config.approvalSecret);
  return out(await client.post('/v1/messages', {
    model: a.model,
    messages: a.messages,
    max_tokens: a.maxTokens,
    system: a.system,
    temperature: a.temperature,
    stop_sequences: a.stopSequences
  }));
});

server.tool('anthropic.batch.list', 'List Message Batches. READ.', {
  limit, beforeId: cursor, afterId: cursor
}, async a => out(await client.get('/v1/messages/batches', { limit: a.limit, before_id: a.beforeId, after_id: a.afterId })));

server.tool('anthropic.batch.get', 'Get one Message Batch. READ.', {
  batchId: z.string().min(1).max(200)
}, async a => out(await client.get(`/v1/messages/batches/${enc(a.batchId)}`)));

server.tool('anthropic.batch.results', 'Retrieve completed Message Batch results as JSONL. READ.', {
  batchId: z.string().min(1).max(200)
}, async a => out(await client.get<string>(`/v1/messages/batches/${enc(a.batchId)}/results`)));

const batchRequest = z.object({
  customId: z.string().min(1).max(200),
  model,
  maxTokens: z.number().int().min(1).max(config.maxOutputTokens),
  messages,
  system: z.string().max(200000).optional()
});

server.tool('anthropic.batch.create', 'Create a Message Batch. WRITE and potentially high cost; explicit approval required.', {
  requests: z.array(batchRequest).min(1).max(config.maxBatchRequests),
  approvalId
}, async a => {
  for (const request of a.requests) assertModelAllowed(config, request.model);
  assertApproval('anthropic.batch.create', a.approvalId, config.approvalSecret);
  const customIds = new Set(a.requests.map(r => r.customId));
  if (customIds.size !== a.requests.length) throw new Error('Batch customId values must be unique');
  return out(await client.post('/v1/messages/batches', {
    requests: a.requests.map(r => ({
      custom_id: r.customId,
      params: { model: r.model, max_tokens: r.maxTokens, messages: r.messages, system: r.system }
    }))
  }));
});

server.tool('anthropic.batch.cancel', 'Cancel an in-progress Message Batch. HIGH_RISK; explicit approval required.', {
  batchId: z.string().min(1).max(200),
  approvalId
}, async a => {
  assertApproval('anthropic.batch.cancel', a.approvalId, config.approvalSecret);
  return out(await client.post(`/v1/messages/batches/${enc(a.batchId)}/cancel`, {}));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
