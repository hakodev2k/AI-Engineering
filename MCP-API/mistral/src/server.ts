import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { MistralClient } from './client.js';
import { assertInputBudget, assertModelAllowed, assertSafeRemoteUrl, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new MistralClient(config);
const server = new McpServer({ name: 'mistral-mcp-connector', version: '1.0.0' });
const model = z.string().min(1).max(200);
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const message = z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string().max(100000) });

server.tool('mistral.model.list', 'List Mistral models available to the configured API key. READ.', {}, async () => out(await client.get('/v1/models')));

server.tool('mistral.model.get', 'Get metadata for one Mistral model. READ.', { model }, async a => {
  assertModelAllowed(config, a.model);
  return out(await client.get(`/v1/models/${encodeURIComponent(a.model)}`));
});

server.tool('mistral.chat.complete', 'Create a non-streaming Mistral chat completion. WRITE/billable; optional operator approval can be enforced.', {
  model,
  messages: z.array(message).min(1).max(128),
  temperature: z.number().min(0).max(1.5).optional(),
  maxTokens: z.number().int().min(1).max(config.maxOutputTokens).optional(),
  safePrompt: z.boolean().optional(),
  responseFormat: z.enum(['text', 'json_object']).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model); assertInputBudget(config, a.messages); assertApproval(config, 'mistral.chat.complete', a.approvalId);
  return out(await client.post('/v1/chat/completions', {
    model: a.model,
    messages: a.messages,
    temperature: a.temperature,
    max_tokens: a.maxTokens,
    safe_prompt: a.safePrompt,
    ...(a.responseFormat ? { response_format: { type: a.responseFormat } } : {}),
    stream: false
  }));
});

server.tool('mistral.embedding.create', 'Create embeddings for text. WRITE/billable; optional approval can be enforced.', {
  model,
  input: z.union([z.string().min(1).max(100000), z.array(z.string().min(1).max(100000)).min(1).max(64)]),
  outputDimension: z.number().int().positive().max(65536).optional(),
  outputDtype: z.enum(['float', 'int8', 'uint8', 'binary', 'ubinary']).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model); assertInputBudget(config, a.input); assertApproval(config, 'mistral.embedding.create', a.approvalId);
  return out(await client.post('/v1/embeddings', { model: a.model, input: a.input, output_dimension: a.outputDimension, output_dtype: a.outputDtype }));
});

server.tool('mistral.code.complete', 'Create a Fill-in-the-Middle code completion through the official FIM API. WRITE/billable.', {
  model,
  prompt: z.string().min(1).max(100000),
  suffix: z.string().max(100000).optional(),
  maxTokens: z.number().int().min(1).max(config.maxOutputTokens).optional(),
  temperature: z.number().min(0).max(1.5).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model); assertInputBudget(config, `${a.prompt}${a.suffix ?? ''}`); assertApproval(config, 'mistral.code.complete', a.approvalId);
  return out(await client.post('/v1/fim/completions', { model: a.model, prompt: a.prompt, suffix: a.suffix, max_tokens: a.maxTokens, temperature: a.temperature, stream: false }));
});

server.tool('mistral.moderation.text', 'Classify text with the Mistral moderation API. READ classification.', {
  model: model.default('mistral-moderation-latest'),
  input: z.union([z.string().min(1).max(100000), z.array(z.string().min(1).max(100000)).min(1).max(64)])
}, async a => {
  assertModelAllowed(config, a.model); assertInputBudget(config, a.input);
  return out(await client.post('/v1/moderations', { model: a.model, input: a.input }));
});

server.tool('mistral.moderation.chat', 'Classify conversation content with the Mistral chat moderation API. READ classification.', {
  model: model.default('mistral-moderation-latest'),
  messages: z.array(message).min(1).max(128)
}, async a => {
  assertModelAllowed(config, a.model); assertInputBudget(config, a.messages);
  return out(await client.post('/v1/chat/moderations', { model: a.model, input: a.messages }));
});

server.tool('mistral.ocr.process', 'Extract text/structure from a public HTTPS document or image URL using Mistral OCR. WRITE/billable.', {
  model,
  url: z.string().url().max(4000),
  kind: z.enum(['document_url', 'image_url']).default('document_url'),
  includeImageBase64: z.boolean().optional(),
  pages: z.array(z.number().int().nonnegative()).max(100).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model); assertSafeRemoteUrl(a.url); assertApproval(config, 'mistral.ocr.process', a.approvalId);
  return out(await client.post('/v1/ocr', {
    model: a.model,
    document: { type: a.kind, [a.kind]: a.url },
    include_image_base64: a.includeImageBase64,
    pages: a.pages
  }));
});

server.tool('mistral.audio.transcribe', 'Transcribe an audio file available at a public HTTPS URL. WRITE/billable.', {
  model,
  fileUrl: z.string().url().max(4000),
  language: z.string().min(2).max(20).optional(),
  diarize: z.boolean().optional(),
  timestampGranularities: z.array(z.enum(['segment', 'word'])).max(2).optional(),
  temperature: z.number().min(0).max(1).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model); assertSafeRemoteUrl(a.fileUrl); assertApproval(config, 'mistral.audio.transcribe', a.approvalId);
  return out(await client.post('/v1/audio/transcriptions', {
    model: a.model,
    file_url: a.fileUrl,
    language: a.language,
    diarize: a.diarize ?? false,
    timestamp_granularities: a.timestampGranularities,
    temperature: a.temperature,
    stream: false
  }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
