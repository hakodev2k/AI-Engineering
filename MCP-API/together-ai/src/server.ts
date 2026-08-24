import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { TogetherClient } from './client.js';
import { assertModelAllowed, loadConfig } from './config.js';
import { assertApproval, assertCostingWriteEnabled, assertFineTuningEnabled } from './policy.js';

const config = loadConfig();
const client = new TogetherClient(config);
const server = new McpServer({ name: 'together-ai-mcp-connector', version: '1.0.0' });
const approvalId = z.string().length(64).optional();
const model = z.string().min(1).max(300);
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const approvedCosting = (tool: string, approval?: string) => {
  assertCostingWriteEnabled(config, tool);
  assertApproval(tool, approval, config.approvalSecret);
};

server.tool('together.model.list', 'List Together AI models and pricing metadata. READ.', {
  dedicated: z.boolean().optional()
}, async a => out(await client.get('/models', { dedicated: a.dedicated })));

server.tool('together.chat.complete', 'Create a non-streaming chat completion. Cost-incurring WRITE; explicit approval required.', {
  model,
  messages: z.array(z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string().max(200000) })).min(1).max(100),
  maxTokens: z.number().int().min(1).max(131072).optional(),
  temperature: z.number().min(0).max(2).optional(),
  topP: z.number().min(0).max(1).optional(),
  seed: z.number().int().optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model); approvedCosting('together.chat.complete', a.approvalId);
  return out(await client.post('/chat/completions', { model: a.model, messages: a.messages, max_tokens: a.maxTokens, temperature: a.temperature, top_p: a.topP, seed: a.seed, stream: false }));
});

server.tool('together.embedding.create', 'Create embeddings for text input. Cost-incurring WRITE; explicit approval required.', {
  model,
  input: z.union([z.string().max(200000), z.array(z.string().max(200000)).min(1).max(256)]),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model); approvedCosting('together.embedding.create', a.approvalId);
  return out(await client.post('/embeddings', { model: a.model, input: a.input }));
});

server.tool('together.rerank.create', 'Rerank documents for a query. Cost-incurring WRITE; explicit approval required.', {
  model,
  query: z.string().min(1).max(50000),
  documents: z.array(z.union([z.string().max(100000), z.record(z.string(), z.unknown())])).min(1).max(256),
  topN: z.number().int().min(1).max(256).optional(),
  returnDocuments: z.boolean().optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model); approvedCosting('together.rerank.create', a.approvalId);
  return out(await client.post('/rerank', { model: a.model, query: a.query, documents: a.documents, top_n: a.topN, return_documents: a.returnDocuments }));
});

server.tool('together.image.generate', 'Generate images from a text prompt. Cost-incurring WRITE; explicit approval required.', {
  model,
  prompt: z.string().min(1).max(20000),
  width: z.number().int().min(64).max(4096).optional(),
  height: z.number().int().min(64).max(4096).optional(),
  steps: z.number().int().min(1).max(100).optional(),
  n: z.number().int().min(1).max(4).optional(),
  seed: z.number().int().optional(),
  responseFormat: z.enum(['url', 'base64']).optional(),
  outputFormat: z.enum(['jpeg', 'png']).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model); approvedCosting('together.image.generate', a.approvalId);
  return out(await client.post('/images/generations', { model: a.model, prompt: a.prompt, width: a.width, height: a.height, steps: a.steps, n: a.n, seed: a.seed, response_format: a.responseFormat, output_format: a.outputFormat }));
});

server.tool('together.fine_tuning.list', 'List fine-tuning jobs. READ.', {}, async () => out(await client.get('/fine-tunes')));

server.tool('together.fine_tuning.get', 'Get one fine-tuning job. READ.', {
  id: z.string().regex(/^ft-[A-Za-z0-9_-]+$/).max(200)
}, async a => out(await client.get(`/fine-tunes/${encodeURIComponent(a.id)}`)));

server.tool('together.fine_tuning.create', 'Create a fine-tuning job from an existing Together file ID. HIGH_RISK and explicit approval required.', {
  model,
  trainingFile: z.string().min(1).max(300),
  validationFile: z.string().max(300).optional(),
  nEpochs: z.number().int().min(1).max(20).optional(),
  nCheckpoints: z.number().int().min(1).max(20).optional(),
  nEvals: z.number().int().min(0).max(100).optional(),
  suffix: z.string().max(40).optional(),
  approvalId
}, async a => {
  assertFineTuningEnabled(config, 'together.fine_tuning.create'); assertModelAllowed(config, a.model);
  assertApproval('together.fine_tuning.create', a.approvalId, config.approvalSecret);
  return out(await client.post('/fine-tunes', { model: a.model, training_file: a.trainingFile, validation_file: a.validationFile, n_epochs: a.nEpochs, n_checkpoints: a.nCheckpoints, n_evals: a.nEvals, suffix: a.suffix }));
});

server.tool('together.fine_tuning.cancel', 'Cancel a running fine-tuning job. HIGH_RISK and explicit approval required.', {
  id: z.string().regex(/^ft-[A-Za-z0-9_-]+$/).max(200), approvalId
}, async a => {
  assertFineTuningEnabled(config, 'together.fine_tuning.cancel');
  assertApproval('together.fine_tuning.cancel', a.approvalId, config.approvalSecret);
  return out(await client.post(`/fine-tunes/${encodeURIComponent(a.id)}/cancel`, {}));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
