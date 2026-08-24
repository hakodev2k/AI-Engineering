import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { GroqClient } from './client.js';
import { assertModelAllowed, loadConfig } from './config.js';
import { assertApproval, assertDestructiveEnabled } from './policy.js';

const config = loadConfig();
const client = new GroqClient(config);
const server = new McpServer({ name: 'groq-mcp-connector', version: '1.0.0' });
const approvalId = z.string().length(64).optional();
const resourceId = z.string().min(1).max(200).regex(/^[A-Za-z0-9._:-]+$/);
const modelId = z.string().min(1).max(200).regex(/^[A-Za-z0-9._:/-]+$/);
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('groq.model.list', 'List active GroqCloud models. Permission: READ.', {}, async () => out(await client.get('/models')));

server.tool('groq.model.get', 'Retrieve metadata for one GroqCloud model. Permission: READ.', { model: modelId }, async a => {
  assertModelAllowed(config, a.model);
  return out(await client.get(`/models/${encodeURIComponent(a.model)}`));
});

server.tool('groq.chat.complete', 'Create a Groq chat completion. Permission: WRITE (billable); approval is configurable and enabled by default.', {
  model: modelId,
  messages: z.array(z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string().min(1).max(100000) })).min(1).max(100),
  temperature: z.number().min(0).max(2).optional(),
  maxCompletionTokens: z.number().int().min(1).max(65536).optional(),
  seed: z.number().int().optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  assertApproval('groq.chat.complete', a.approvalId, config);
  return out(await client.post('/chat/completions', {
    model: a.model,
    messages: a.messages,
    temperature: a.temperature,
    max_completion_tokens: a.maxCompletionTokens,
    seed: a.seed,
    stream: false
  }));
});

server.tool('groq.response.create', 'Create a Groq Responses API response from text input. Permission: WRITE (billable); approval is configurable and enabled by default.', {
  model: modelId,
  input: z.string().min(1).max(200000),
  instructions: z.string().max(100000).optional(),
  maxOutputTokens: z.number().int().min(1).max(65536).optional(),
  temperature: z.number().min(0).max(2).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  assertApproval('groq.response.create', a.approvalId, config);
  return out(await client.post('/responses', {
    model: a.model,
    input: a.input,
    instructions: a.instructions,
    max_output_tokens: a.maxOutputTokens,
    temperature: a.temperature
  }));
});

server.tool('groq.batch.list', 'List Groq batch jobs with cursor pagination. Permission: READ.', {
  cursor: z.string().max(500).optional(), limit: z.number().int().min(1).max(100).optional()
}, async a => out(await client.get('/batches', { cursor: a.cursor, limit: a.limit })));

server.tool('groq.batch.get', 'Retrieve a Groq batch job. Permission: READ.', { batchId: resourceId }, async a => out(await client.get(`/batches/${encodeURIComponent(a.batchId)}`)));

server.tool('groq.batch.create', 'Create a billable asynchronous chat-completions batch from a pre-uploaded batch file. Permission: HIGH_RISK; explicit approval required.', {
  inputFileId: resourceId,
  completionWindow: z.enum(['24h', '48h', '72h', '4d', '5d', '6d', '7d']).default('24h'),
  metadata: z.record(z.string(), z.string().max(500)).optional(),
  approvalId
}, async a => {
  assertApproval('groq.batch.create', a.approvalId, config, true);
  return out(await client.post('/batches', {
    input_file_id: a.inputFileId,
    endpoint: '/v1/chat/completions',
    completion_window: a.completionWindow,
    metadata: a.metadata
  }));
});

server.tool('groq.batch.cancel', 'Cancel an in-progress Groq batch. Permission: HIGH_RISK; explicit approval required.', {
  batchId: resourceId, approvalId
}, async a => {
  assertApproval('groq.batch.cancel', a.approvalId, config, true);
  return out(await client.post(`/batches/${encodeURIComponent(a.batchId)}/cancel`));
});

server.tool('groq.file.list', 'List files stored for Groq batch processing. Permission: READ.', {}, async () => out(await client.get('/files')));

server.tool('groq.file.get', 'Retrieve metadata for a Groq file. Permission: READ.', { fileId: resourceId }, async a => out(await client.get(`/files/${encodeURIComponent(a.fileId)}`)));

server.tool('groq.file.delete', 'Delete a Groq file. Permission: DESTRUCTIVE; disabled by default and always requires explicit approval.', {
  fileId: resourceId, approvalId
}, async a => {
  assertDestructiveEnabled(config);
  assertApproval('groq.file.delete', a.approvalId, config, true);
  return out(await client.delete(`/files/${encodeURIComponent(a.fileId)}`));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
