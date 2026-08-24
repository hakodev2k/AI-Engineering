import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { CohereClient } from './client.js';
import { assertModelAllowed, loadConfig } from './config.js';
import { assertWriteApproval } from './policy.js';

const config = loadConfig();
const client = new CohereClient(config);
const server = new McpServer({ name: 'cohere-mcp-connector', version: '1.0.0' });
const approvalId = z.string().length(64).optional();
const model = z.string().min(1).max(200);
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const message = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1).max(200000)
}).strict();

server.tool('cohere.model.list', 'List Cohere models visible to the configured API key. Risk: READ.', {}, async () => {
  return out(await client.get('/v1/models'));
});

server.tool('cohere.model.get', 'Get metadata for one Cohere model. Risk: READ.', { model }, async a => {
  assertModelAllowed(config, a.model);
  return out(await client.get(`/v1/models/${encodeURIComponent(a.model)}`));
});

server.tool('cohere.chat.create', 'Generate a non-streaming Cohere Chat response. Billable WRITE/COMPUTE; approval is configurable and enabled by default.', {
  model,
  messages: z.array(message).min(1).max(100),
  documents: z.array(z.string().min(1).max(100000)).max(50).optional(),
  maxTokens: z.number().int().min(1).max(32768).optional(),
  temperature: z.number().min(0).max(2).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  assertWriteApproval(config, 'cohere.chat.create', a.approvalId);
  return out(await client.post('/v2/chat', {
    model: a.model,
    messages: a.messages,
    documents: a.documents,
    max_tokens: a.maxTokens,
    temperature: a.temperature,
    stream: false
  }));
});

server.tool('cohere.embedding.create', 'Create text embeddings with Cohere Embed v2. Billable WRITE/COMPUTE; approval is configurable and enabled by default.', {
  model,
  texts: z.array(z.string().min(1).max(100000)).min(1).max(96),
  inputType: z.enum(['search_document', 'search_query', 'classification', 'clustering']),
  embeddingTypes: z.array(z.enum(['float', 'int8', 'uint8', 'binary', 'ubinary'])).min(1).max(5).default(['float']),
  truncate: z.enum(['NONE', 'START', 'END']).optional(),
  maxTokens: z.number().int().min(1).max(131072).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  assertWriteApproval(config, 'cohere.embedding.create', a.approvalId);
  return out(await client.post('/v2/embed', {
    model: a.model,
    texts: a.texts,
    input_type: a.inputType,
    embedding_types: a.embeddingTypes,
    truncate: a.truncate,
    max_tokens: a.maxTokens
  }));
});

server.tool('cohere.rerank.create', 'Rerank documents against a query using Cohere Rerank v2. Billable WRITE/COMPUTE; approval is configurable and enabled by default.', {
  model,
  query: z.string().min(1).max(100000),
  documents: z.array(z.string().min(1).max(100000)).min(1).max(1000),
  topN: z.number().int().min(1).max(1000).optional(),
  maxTokensPerDoc: z.number().int().min(1).max(32768).optional(),
  priority: z.number().int().min(0).max(999).optional(),
  approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  if (a.topN !== undefined && a.topN > a.documents.length) throw new Error('topN cannot exceed the number of documents');
  assertWriteApproval(config, 'cohere.rerank.create', a.approvalId);
  return out(await client.post('/v2/rerank', {
    model: a.model,
    query: a.query,
    documents: a.documents,
    top_n: a.topN,
    max_tokens_per_doc: a.maxTokensPerDoc,
    priority: a.priority
  }));
});

server.tool('cohere.tokenize.create', 'Tokenize text with the tokenizer for a Cohere model. Risk: READ.', {
  model,
  text: z.string().min(1).max(500000)
}, async a => {
  assertModelAllowed(config, a.model);
  return out(await client.post('/v1/tokenize', { model: a.model, text: a.text }));
});

server.tool('cohere.detokenize.create', 'Convert Cohere token IDs back to text for a model. Risk: READ.', {
  model,
  tokens: z.array(z.number().int().nonnegative()).min(1).max(100000)
}, async a => {
  assertModelAllowed(config, a.model);
  return out(await client.post('/v1/detokenize', { model: a.model, tokens: a.tokens }));
});

server.tool('cohere.dataset.list', 'List datasets visible to the configured Cohere API key. Risk: READ.', {}, async () => {
  return out(await client.get('/v1/datasets'));
});

server.tool('cohere.dataset.get', 'Get one Cohere dataset by ID. Risk: READ.', {
  datasetId: z.string().min(1).max(200).regex(/^[A-Za-z0-9._-]+$/)
}, async a => {
  return out(await client.get(`/v1/datasets/${encodeURIComponent(a.datasetId)}`));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
