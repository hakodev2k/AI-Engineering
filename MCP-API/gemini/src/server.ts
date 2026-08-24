import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { GeminiClient } from './client.js';
import { assertModelAllowed, assertUploadPathAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new GeminiClient(config);
const server = new McpServer({ name: 'gemini-mcp-connector', version: '1.0.0' });
const model = z.string().min(1).max(200);
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('gemini.model.list', 'List Gemini API models visible to the configured project.', {
  pageSize: z.number().int().min(1).max(1000).optional(), pageToken: z.string().max(2000).optional()
}, async a => out(await client.get('/models', { pageSize: a.pageSize, pageToken: a.pageToken })));

server.tool('gemini.model.get', 'Get metadata for one Gemini model.', { model }, async a => {
  assertModelAllowed(config, a.model);
  return out(await client.get(`/models/${encodeURIComponent(a.model)}`));
});

server.tool('gemini.token.count', 'Count tokens for text content before generation.', {
  model, text: z.string().min(1).max(200000)
}, async a => {
  assertModelAllowed(config, a.model);
  return out(await client.post(`/models/${encodeURIComponent(a.model)}:countTokens`, { contents: [{ parts: [{ text: a.text }] }] }));
});

server.tool('gemini.content.generate', 'Generate content with a Gemini model. Billable and approval-gated by default.', {
  model, prompt: z.string().min(1).max(200000), systemInstruction: z.string().max(50000).optional(), temperature: z.number().min(0).max(2).optional(), maxOutputTokens: z.number().int().min(1).max(65536).optional(), responseMimeType: z.enum(['text/plain', 'application/json']).optional(), approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  if (config.requireApprovalForBillable) assertApproval('gemini.content.generate', a.approvalId, config.approvalSecret);
  const body: Record<string, unknown> = { contents: [{ parts: [{ text: a.prompt }] }] };
  if (a.systemInstruction) body.systemInstruction = { parts: [{ text: a.systemInstruction }] };
  const generationConfig: Record<string, unknown> = {};
  if (a.temperature !== undefined) generationConfig.temperature = a.temperature;
  if (a.maxOutputTokens !== undefined) generationConfig.maxOutputTokens = a.maxOutputTokens;
  if (a.responseMimeType) generationConfig.responseMimeType = a.responseMimeType;
  if (Object.keys(generationConfig).length) body.generationConfig = generationConfig;
  return out(await client.post(`/models/${encodeURIComponent(a.model)}:generateContent`, body));
});

server.tool('gemini.embedding.create', 'Create a text embedding. Billable and approval-gated by default.', {
  model: model.default('gemini-embedding-001'), text: z.string().min(1).max(50000), taskType: z.enum(['RETRIEVAL_QUERY','RETRIEVAL_DOCUMENT','SEMANTIC_SIMILARITY','CLASSIFICATION','CLUSTERING']).optional(), outputDimensionality: z.number().int().min(128).max(3072).optional(), approvalId
}, async a => {
  assertModelAllowed(config, a.model);
  if (config.requireApprovalForBillable) assertApproval('gemini.embedding.create', a.approvalId, config.approvalSecret);
  return out(await client.post(`/models/${encodeURIComponent(a.model)}:embedContent`, {
    content: { parts: [{ text: a.text }] }, taskType: a.taskType, outputDimensionality: a.outputDimensionality
  }));
});

server.tool('gemini.file.list', 'List files uploaded to the Gemini Files API.', {
  pageSize: z.number().int().min(1).max(100).optional(), pageToken: z.string().max(2000).optional()
}, async a => out(await client.get('/files', { pageSize: a.pageSize, pageToken: a.pageToken })));

server.tool('gemini.file.get', 'Get Gemini Files API metadata.', {
  name: z.string().regex(/^files\/[A-Za-z0-9._-]+$/)
}, async a => out(await client.get(`/${a.name}`)));

server.tool('gemini.file.upload', 'Upload a local file to Gemini Files API. HIGH_RISK because data leaves the machine; explicit approval required.', {
  path: z.string().min(1).max(4096), mimeType: z.string().min(3).max(200).regex(/^[A-Za-z0-9.+-]+\/[A-Za-z0-9.+-]+$/), displayName: z.string().max(500).optional(), approvalId
}, async a => {
  assertApproval('gemini.file.upload', a.approvalId, config.approvalSecret);
  const safePath = assertUploadPathAllowed(config, a.path);
  return out(await client.uploadFile(safePath, a.mimeType, a.displayName));
});

server.tool('gemini.file.delete', 'Delete a Gemini Files API object before its automatic expiration. DESTRUCTIVE; explicit approval required.', {
  name: z.string().regex(/^files\/[A-Za-z0-9._-]+$/), approvalId
}, async a => {
  assertApproval('gemini.file.delete', a.approvalId, config.approvalSecret);
  return out(await client.delete(`/${a.name}`));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
