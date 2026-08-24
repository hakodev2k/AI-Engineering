import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { FireworksClient } from './client.js';
import { assertModelAllowed, loadConfig, requireAccountId } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new FireworksClient(config);
const server = new McpServer({ name: 'fireworks-ai-mcp-connector', version: '1.0.0' });
const approvalId = z.string().length(64).optional();
const model = z.string().min(1).max(500);
const id = z.string().min(1).max(200).regex(/^[A-Za-z0-9._-]+$/);
const pageSize = z.number().int().min(1).max(200).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const enc = encodeURIComponent;

function ensureChars(values: string[]) {
  const chars = values.reduce((sum, value) => sum + value.length, 0);
  if (chars > config.maxInputChars) throw new Error(`Input exceeds FIREWORKS_MAX_INPUT_CHARS (${config.maxInputChars})`);
}

function approved(tool: string, value?: string) {
  assertApproval(tool, value, config.approvalSecret);
}

server.tool('fireworks.model.list', 'READ/models.read. List account models; no approval required.', {
  pageSize, pageToken: z.string().max(1000).optional(), filter: z.string().max(1000).optional(), orderBy: z.string().max(500).optional()
}, async a => {
  const account = requireAccountId(config);
  return out(await client.platformGet(`/accounts/${enc(account)}/models`, { pageSize: a.pageSize, pageToken: a.pageToken, filter: a.filter, orderBy: a.orderBy }));
});

server.tool('fireworks.model.get', 'READ/models.read. Get account model metadata; no approval required.', { modelId: id }, async a => {
  const account = requireAccountId(config);
  return out(await client.platformGet(`/accounts/${enc(account)}/models/${enc(a.modelId)}`));
});

server.tool('fireworks.deployment.list', 'READ/deployments.read. List account deployments; no approval required.', {
  pageSize, pageToken: z.string().max(1000).optional(), filter: z.string().max(1000).optional(), orderBy: z.string().max(500).optional(), showDeleted: z.boolean().optional()
}, async a => {
  const account = requireAccountId(config);
  return out(await client.platformGet(`/accounts/${enc(account)}/deployments`, { pageSize: a.pageSize, pageToken: a.pageToken, filter: a.filter, orderBy: a.orderBy, showDeleted: a.showDeleted }));
});

server.tool('fireworks.deployment.get', 'READ/deployments.read. Get deployment metadata; no approval required.', { deploymentId: id }, async a => {
  const account = requireAccountId(config);
  return out(await client.platformGet(`/accounts/${enc(account)}/deployments/${enc(a.deploymentId)}`));
});

server.tool('fireworks.chat.create', 'WRITE/inference.execute. Run a non-streaming chat completion. Explicit approval required.', {
  model,
  messages: z.array(z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string().max(config.maxInputChars) })).min(1).max(200),
  maxTokens: z.number().int().min(1).max(131072).optional(), temperature: z.number().min(0).max(2).optional(), topP: z.number().min(0).max(1).optional(), serviceTier: z.enum(['default', 'priority']).optional(), approvalId
}, async a => {
  assertModelAllowed(config, a.model); ensureChars(a.messages.map(m => m.content)); approved('fireworks.chat.create', a.approvalId);
  return out(await client.inferencePost('/chat/completions', { model: a.model, messages: a.messages, max_tokens: a.maxTokens, temperature: a.temperature, top_p: a.topP, service_tier: a.serviceTier, stream: false }));
});

server.tool('fireworks.completion.create', 'WRITE/inference.execute. Run a non-streaming raw text completion. Explicit approval required.', {
  model, prompt: z.string().min(1).max(config.maxInputChars), maxTokens: z.number().int().min(1).max(131072).optional(), temperature: z.number().min(0).max(2).optional(), topP: z.number().min(0).max(1).optional(), approvalId
}, async a => {
  assertModelAllowed(config, a.model); ensureChars([a.prompt]); approved('fireworks.completion.create', a.approvalId);
  return out(await client.inferencePost('/completions', { model: a.model, prompt: a.prompt, max_tokens: a.maxTokens, temperature: a.temperature, top_p: a.topP, stream: false }));
});

server.tool('fireworks.response.create', 'WRITE/responses.write. Create a non-streaming Responses API response without arbitrary external tools. Explicit approval required.', {
  model, input: z.string().min(1).max(config.maxInputChars), instructions: z.string().max(config.maxInputChars).optional(), previousResponseId: z.string().max(500).optional(), maxOutputTokens: z.number().int().min(1).max(131072).optional(), store: z.boolean().optional(), approvalId
}, async a => {
  assertModelAllowed(config, a.model); ensureChars([a.input, a.instructions ?? '']); approved('fireworks.response.create', a.approvalId);
  return out(await client.inferencePost('/responses', { model: a.model, input: a.input, instructions: a.instructions, previous_response_id: a.previousResponseId, max_output_tokens: a.maxOutputTokens, store: a.store ?? false, stream: false }));
});

server.tool('fireworks.response.list', 'READ/responses.read. List stored Responses API responses; no approval required.', {
  limit: z.number().int().min(1).max(100).optional(), after: z.string().max(500).optional(), order: z.enum(['asc', 'desc']).optional()
}, async a => out(await client.inferenceGet('/responses', { limit: a.limit, after: a.after, order: a.order })));

server.tool('fireworks.embedding.create', 'WRITE/inference.execute. Generate embeddings. Explicit approval required.', {
  model, input: z.union([z.string().min(1).max(config.maxInputChars), z.array(z.string().min(1).max(config.maxInputChars)).min(1).max(config.maxDocuments)]), dimensions: z.number().int().positive().max(65536).optional(), approvalId
}, async a => {
  assertModelAllowed(config, a.model); const values = Array.isArray(a.input) ? a.input : [a.input]; ensureChars(values); approved('fireworks.embedding.create', a.approvalId);
  return out(await client.inferencePost('/embeddings', { model: a.model, input: a.input, dimensions: a.dimensions }));
});

server.tool('fireworks.rerank.create', 'WRITE/inference.execute. Rerank documents by relevance. Explicit approval required.', {
  model, query: z.string().min(1).max(config.maxInputChars), documents: z.array(z.string().min(1).max(config.maxInputChars)).min(1).max(config.maxDocuments), topN: z.number().int().positive().max(config.maxDocuments).optional(), returnDocuments: z.boolean().optional(), task: z.string().max(2000).optional(), approvalId
}, async a => {
  assertModelAllowed(config, a.model); ensureChars([a.query, ...a.documents]); if (a.topN && a.topN > a.documents.length) throw new Error('topN cannot exceed documents.length'); approved('fireworks.rerank.create', a.approvalId);
  return out(await client.inferencePost('/rerank', { model: a.model, query: a.query, documents: a.documents, top_n: a.topN, return_documents: a.returnDocuments ?? true, task: a.task }));
});

server.tool('fireworks.deployment.create', 'HIGH_RISK/deployments.write. Create billable dedicated capacity. Explicit human approval required.', {
  baseModel: model, displayName: z.string().min(1).max(63), description: z.string().max(2000).optional(), minReplicaCount: z.number().int().min(0).max(100).optional(), maxReplicaCount: z.number().int().min(1).max(100).optional(), acceleratorCount: z.number().int().min(1).max(64).optional(), acceleratorType: z.string().max(100).optional(), precision: z.string().max(100).optional(), deploymentShape: z.string().max(200).optional(), approvalId
}, async a => {
  const account = requireAccountId(config); assertModelAllowed(config, a.baseModel); approved('fireworks.deployment.create', a.approvalId);
  if (a.minReplicaCount !== undefined && a.maxReplicaCount !== undefined && a.minReplicaCount > a.maxReplicaCount) throw new Error('minReplicaCount cannot exceed maxReplicaCount');
  return out(await client.platformPost(`/accounts/${enc(account)}/deployments`, { baseModel: a.baseModel, displayName: a.displayName, description: a.description, minReplicaCount: a.minReplicaCount, maxReplicaCount: a.maxReplicaCount, acceleratorCount: a.acceleratorCount, acceleratorType: a.acceleratorType, precision: a.precision, deploymentShape: a.deploymentShape }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
