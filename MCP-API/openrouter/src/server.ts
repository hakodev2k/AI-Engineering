import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { OpenRouterClient } from './client.js';
import { assertModelAllowed, loadConfig, requireApiKey, requireManagementKey } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new OpenRouterClient(config);
const server = new McpServer({ name: 'openrouter-mcp-connector', version: '1.0.0' });
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const approvalId = z.string().length(64).optional();
const model = z.string().min(1).max(300);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

server.tool('openrouter.model.list', 'List current OpenRouter models with pricing, context, supported parameters, and optional server-side sorting/filtering. READ.', {
  outputModalities: z.enum(['text', 'image', 'audio', 'embeddings', 'all']).optional(),
  supportedParameters: z.string().max(500).optional(),
  sort: z.enum(['pricing-low-to-high','pricing-high-to-low','context-high-to-low','throughput-high-to-low','latency-low-to-high','most-popular','top-weekly','newest','intelligence-high-to-low','design-arena-elo-high-to-low']).optional()
}, async a => out(await client.get('/models', config.apiKey, {
  output_modalities: a.outputModalities,
  supported_parameters: a.supportedParameters,
  sort: a.sort
})));

server.tool('openrouter.benchmark.list', 'List OpenRouter benchmark data from supported benchmark sources. READ.', {},
  async () => out(await client.get('/benchmarks', requireApiKey(config))));

server.tool('openrouter.generation.get', 'Get request, routing, token, latency, and cost metadata for one generation. READ.', {
  id: z.string().min(1).max(200)
}, async a => out(await client.get('/generation', requireApiKey(config), { id: a.id })));

server.tool('openrouter.generation.content.get', 'Read stored prompt/completion content for a generation when logging retained it. HIGH_RISK because it can expose sensitive content; explicit approval required.', {
  id: z.string().min(1).max(200), approvalId
}, async a => {
  assertApproval('openrouter.generation.content.get', a.approvalId, config.approvalSecret);
  return out(await client.get('/generation/content', requireApiKey(config), { id: a.id }));
});

server.tool('openrouter.activity.list', 'Get authenticated workspace/user activity grouped by endpoint for recent completed UTC days. Requires a management key. READ.', {
  date: date.optional(),
  apiKeyHash: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  userId: z.string().min(1).max(200).optional()
}, async a => out(await client.get('/activity', requireManagementKey(config), {
  date: a.date,
  api_key_hash: a.apiKeyHash,
  user_id: a.userId
})));

server.tool('openrouter.credits.get', 'Get total credits purchased and total usage. Requires a management key. READ.', {},
  async () => out(await client.get('/credits', requireManagementKey(config))));

server.tool('openrouter.analytics.meta', 'Get supported analytics metrics, dimensions, granularities, and filter operators. Requires a management key. READ.', {},
  async () => out(await client.get('/analytics/meta', requireManagementKey(config))));

server.tool('openrouter.analytics.query', 'Run a bounded analytics aggregation query using documented metrics, dimensions, granularity, time range, and limits. Requires a management key. READ.', {
  metrics: z.array(z.string().min(1).max(100)).min(1).max(20),
  dimensions: z.array(z.string().min(1).max(100)).max(10).optional(),
  granularity: z.string().max(50).optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(5000).optional(),
  groupLimit: z.number().int().min(1).max(5000).optional()
}, async a => out(await client.post('/analytics/query', requireManagementKey(config), {
  metrics: a.metrics,
  dimensions: a.dimensions,
  granularity: a.granularity,
  time_range: a.start || a.end ? { start: a.start, end: a.end } : undefined,
  limit: a.limit,
  group_limit: a.groupLimit
}, true)));

const message = z.object({
  role: z.enum(['system','user','assistant','tool']),
  content: z.string().min(1).max(200000),
  name: z.string().max(100).optional(),
  tool_call_id: z.string().max(200).optional()
});

server.tool('openrouter.inference.chat', 'Create one non-streaming chat completion. WRITE because it transmits content and consumes credits; explicit approval required. No automatic retry.', {
  model,
  messages: z.array(message).min(1).max(200),
  maxTokens: z.number().int().min(1).max(131072).optional(),
  temperature: z.number().min(0).max(2).optional(),
  topP: z.number().min(0).max(1).optional(),
  providerSort: z.enum(['price','throughput','latency']).optional(),
  allowFallbacks: z.boolean().optional(),
  dataCollection: z.enum(['allow','deny']).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  assertApproval('openrouter.inference.chat', a.approvalId, config.approvalSecret);
  return out(await client.post('/chat/completions', requireApiKey(config), {
    model: a.model,
    messages: a.messages,
    stream: false,
    max_tokens: a.maxTokens,
    temperature: a.temperature,
    top_p: a.topP,
    provider: {
      sort: a.providerSort,
      allow_fallbacks: a.allowFallbacks,
      data_collection: a.dataCollection
    }
  }, false));
});

server.tool('openrouter.embedding.create', 'Create embeddings for bounded text input. WRITE because it transmits content and consumes credits; explicit approval required. No automatic retry.', {
  model,
  input: z.union([z.string().min(1).max(200000), z.array(z.string().min(1).max(50000)).min(1).max(100)]),
  dimensions: z.number().int().positive().max(65536).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  assertApproval('openrouter.embedding.create', a.approvalId, config.approvalSecret);
  return out(await client.post('/embeddings', requireApiKey(config), {
    model: a.model,
    input: a.input,
    dimensions: a.dimensions
  }, false));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
