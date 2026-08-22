import { pathToFileURL } from 'node:url';
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod';
import { loadConfig, assertModelAllowed } from './config.mjs';
import { OpenAIClient, OpenAIHttpError } from './client.mjs';
import { TOOL_RISK, assertApproved, operationTarget } from './policy.mjs';

const modelId = z.string().trim().min(1).max(200).regex(/^[A-Za-z0-9._:-]+$/);
const resourceId = z.string().trim().min(1).max(256).regex(/^[A-Za-z0-9._:-]+$/);
const approvalFields = {
  approvalToken: z.string().min(16).max(512).optional(),
  approvalExpiresAt: z.number().int().positive().optional(),
  approvalNonce: z.string().regex(/^[A-Za-z0-9_-]{16,128}$/).optional()
};
const metadata = z.record(z.string().max(64), z.string().max(512))
  .refine(value => Object.keys(value).length <= 16, 'metadata supports at most 16 entries');

export const TOOL_NAMES = Object.freeze([
  'openai.model.list',
  'openai.model.get',
  'openai.response.create',
  'openai.response.get',
  'openai.response.cancel',
  'openai.moderation.create',
  'openai.embedding.create',
  'openai.vector_store.list',
  'openai.vector_store.get',
  'openai.vector_store.create',
  'openai.vector_store.search',
  'openai.file.list',
  'openai.file.get'
]);

function annotationsFor(risk) {
  if (risk === 'READ') return { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
  if (risk === 'HIGH_RISK') return { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true };
  return { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true };
}

function cleanApproval(args) {
  const clean = { ...args };
  delete clean.approvalToken;
  delete clean.approvalExpiresAt;
  delete clean.approvalNonce;
  return clean;
}

function toolResult(name, result) {
  const envelope = {
    provider: 'openai',
    tool: name,
    risk: TOOL_RISK[name],
    untrusted_provider_data: true,
    data: result.data,
    meta: result.meta
  };
  return { content: [{ type: 'text', text: JSON.stringify(envelope) }], structuredContent: envelope };
}

function toolError(error) {
  const safe = error instanceof OpenAIHttpError
    ? { message: error.message, status: error.status, code: error.code, type: error.type, param: error.param, requestId: error.requestId, retryAfterMs: error.retryAfterMs }
    : { message: error instanceof Error ? error.message : 'Unknown connector error' };
  return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: safe }) }] };
}

function register(server, config, name, description, inputSchema, handler) {
  const risk = TOOL_RISK[name];
  server.registerTool(name, {
    description: `${description} Risk=${risk}. ${risk === 'READ' ? 'No approval required.' : risk === 'HIGH_RISK' ? 'Explicit approval always required.' : 'Approval required by default.'}`,
    inputSchema,
    annotations: annotationsFor(risk)
  }, async (args, ctx) => {
    try {
      const clean = cleanApproval(args);
      const target = operationTarget(clean);
      assertApproved(config, name, target, args.approvalToken, args.approvalExpiresAt, args.approvalNonce);
      const result = await handler(clean, ctx?.mcpReq?.signal);
      return toolResult(name, result);
    } catch (error) {
      return toolError(error);
    }
  });
}

export function buildServer(config = loadConfig(), client = new OpenAIClient(config)) {
  const server = new McpServer({ name: 'openai-mcp-connector', version: '1.0.0' });

  register(server, config, 'openai.model.list', 'List models available to the API credential.', z.object({}).strict(), (_, signal) => client.listModels(signal));

  register(server, config, 'openai.model.get', 'Retrieve metadata for one model.', z.object({ model: modelId }).strict(), ({ model }, signal) => client.getModel(model, signal));

  register(server, config, 'openai.response.create', 'Create a text-only Responses API request. This connector intentionally does not expose built-in, MCP, function, computer, or shell tools.', z.object({
    model: modelId,
    input: z.string().min(1).max(200_000),
    instructions: z.string().max(20_000).optional(),
    max_output_tokens: z.number().int().min(1).max(128_000).optional(),
    store: z.boolean().default(false),
    safety_identifier: z.string().max(64).optional(),
    ...approvalFields
  }).strict(), (args, signal) => {
    assertModelAllowed(config, args.model);
    const body = {
      model: args.model,
      input: args.input,
      store: args.store,
      ...(args.instructions !== undefined && { instructions: args.instructions }),
      ...(args.max_output_tokens !== undefined && { max_output_tokens: args.max_output_tokens }),
      ...(args.safety_identifier !== undefined && { safety_identifier: args.safety_identifier })
    };
    return client.createResponse(body, signal);
  });

  register(server, config, 'openai.response.get', 'Retrieve a stored or background response by ID.', z.object({ response_id: resourceId }).strict(), ({ response_id }, signal) => client.getResponse(response_id, signal));

  register(server, config, 'openai.response.cancel', 'Cancel a cancellable background response.', z.object({ response_id: resourceId, ...approvalFields }).strict(), ({ response_id }, signal) => client.cancelResponse(response_id, signal));

  register(server, config, 'openai.moderation.create', 'Classify text with the OpenAI Moderations API.', z.object({
    input: z.string().min(1).max(100_000),
    model: z.enum(['omni-moderation-latest', 'omni-moderation-2024-09-26', 'text-moderation-latest', 'text-moderation-stable']).default('omni-moderation-latest')
  }).strict(), (args, signal) => client.createModeration(args, signal));

  register(server, config, 'openai.embedding.create', 'Create embeddings. Base64 output is the default to reduce MCP payload size.', z.object({
    model: z.enum(['text-embedding-3-small', 'text-embedding-3-large', 'text-embedding-ada-002']),
    input: z.union([z.string().min(1).max(100_000), z.array(z.string().min(1).max(100_000)).min(1).max(256)]),
    dimensions: z.number().int().min(1).max(3072).optional(),
    encoding_format: z.enum(['float', 'base64']).default('base64'),
    ...approvalFields
  }).strict(), (args, signal) => client.createEmbedding(args, signal));

  register(server, config, 'openai.vector_store.list', 'List vector stores with bounded pagination parameters.', z.object({
    limit: z.number().int().min(1).max(100).default(20),
    order: z.enum(['asc', 'desc']).default('desc'),
    after: resourceId.optional(),
    before: resourceId.optional()
  }).strict(), (args, signal) => client.listVectorStores(args, signal));

  register(server, config, 'openai.vector_store.get', 'Retrieve one vector store.', z.object({ vector_store_id: resourceId }).strict(), ({ vector_store_id }, signal) => client.getVectorStore(vector_store_id, signal));

  register(server, config, 'openai.vector_store.create', 'Create a vector store without uploading files.', z.object({
    name: z.string().min(1).max(256),
    description: z.string().max(512).optional(),
    expires_after_days: z.number().int().min(1).max(365).optional(),
    metadata: metadata.optional(),
    ...approvalFields
  }).strict(), (args, signal) => {
    const body = {
      name: args.name,
      ...(args.description !== undefined && { description: args.description }),
      ...(args.expires_after_days !== undefined && { expires_after: { anchor: 'last_active_at', days: args.expires_after_days } }),
      ...(args.metadata !== undefined && { metadata: args.metadata })
    };
    return client.createVectorStore(body, signal);
  });

  register(server, config, 'openai.vector_store.search', 'Search a vector store for relevant chunks. No arbitrary filters are exposed.', z.object({
    vector_store_id: resourceId,
    query: z.union([z.string().min(1).max(10_000), z.array(z.string().min(1).max(10_000)).min(1).max(16)]),
    max_num_results: z.number().int().min(1).max(50).default(10),
    rewrite_query: z.boolean().optional(),
    score_threshold: z.number().min(0).max(1).optional()
  }).strict(), (args, signal) => client.searchVectorStore(args.vector_store_id, {
    query: args.query,
    max_num_results: args.max_num_results,
    ...(args.rewrite_query !== undefined && { rewrite_query: args.rewrite_query }),
    ...(args.score_threshold !== undefined && { ranking_options: { score_threshold: args.score_threshold } })
  }, signal));

  register(server, config, 'openai.file.list', 'List uploaded OpenAI files.', z.object({
    purpose: z.string().trim().min(1).max(64).optional(),
    limit: z.number().int().min(1).max(100).default(20),
    order: z.enum(['asc', 'desc']).default('desc'),
    after: resourceId.optional()
  }).strict(), (args, signal) => client.listFiles(args, signal));

  register(server, config, 'openai.file.get', 'Retrieve metadata for one uploaded file.', z.object({ file_id: resourceId }).strict(), ({ file_id }, signal) => client.getFile(file_id, signal));

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void serveStdio(() => buildServer());
  console.error('openai-mcp-connector running on stdio');
}
