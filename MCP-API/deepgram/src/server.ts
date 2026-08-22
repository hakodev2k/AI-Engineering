import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { DeepgramClient } from './client.js';
import { assertApproval, loadConfig } from './config.js';

const config = loadConfig();
const client = new DeepgramClient(config);
const server = new McpServer({ name: 'deepgram-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const ProjectId = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const DateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

function validateRemoteAudioUrl(raw: string): string {
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error('VALIDATION_ERROR: audio URL must use HTTPS');
  if (url.username || url.password) throw new Error('VALIDATION_ERROR: embedded URL credentials are not allowed');
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host === '::1' || host.startsWith('127.') || host.startsWith('10.') || host.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
    throw new Error('VALIDATION_ERROR: local/private network hosts are not allowed');
  }
  return url.toString();
}

const TranscriptionOptions = {
  model: z.string().min(1).max(100).default('nova-3'),
  language: z.string().min(2).max(20).optional(),
  smart_format: z.boolean().default(true),
  punctuate: z.boolean().optional(),
  diarize: z.boolean().optional(),
  utterances: z.boolean().optional(),
  detect_language: z.boolean().optional(),
  paragraphs: z.boolean().optional(),
  profanity_filter: z.boolean().optional(),
  numerals: z.boolean().optional(),
  tag: z.string().min(1).max(200).optional()
};

server.tool('deepgram.auth.validate', 'Validate the configured Deepgram API key. READ.', {},
  async () => json(await client.request('/v1/auth/token')));

server.tool('deepgram.model.list', 'List public Deepgram STT and TTS models. READ.', {
  include_outdated: z.boolean().default(false)
}, async ({ include_outdated }) => json(await client.request('/v1/models', { query: { include_outdated } })));

server.tool('deepgram.model.get', 'Get metadata for one public model. READ.', { model_id: Id },
  async ({ model_id }) => json(await client.request(`/v1/models/${encodeURIComponent(model_id)}`)));

server.tool('deepgram.project.list', 'List projects visible to the configured API key. READ.', {},
  async () => json(await client.request('/v1/projects')));

server.tool('deepgram.project.get', 'Get one project. READ.', { project_id: ProjectId },
  async ({ project_id }) => json(await client.request(`/v1/projects/${encodeURIComponent(project_id)}`)));

server.tool('deepgram.project.model.list', 'List models available to a project, including custom models. READ.', { project_id: ProjectId },
  async ({ project_id }) => json(await client.request(`/v1/projects/${encodeURIComponent(project_id)}/models`)));

server.tool('deepgram.project.member.list', 'List members of a project. READ; may contain personal information.', { project_id: ProjectId },
  async ({ project_id }) => json(await client.request(`/v1/projects/${encodeURIComponent(project_id)}/members`)));

server.tool('deepgram.project.key.list', 'List API-key metadata for a project. READ; secret key values are not returned by this endpoint.', {
  project_id: ProjectId,
  status: z.enum(['active', 'expired']).optional()
}, async ({ project_id, status }) => json(await client.request(`/v1/projects/${encodeURIComponent(project_id)}/keys`, { query: { status } })));

server.tool('deepgram.project.key.get', 'Get metadata for one project API key. READ; secret key values are not returned.', {
  project_id: ProjectId,
  key_id: Id
}, async ({ project_id, key_id }) => json(await client.request(`/v1/projects/${encodeURIComponent(project_id)}/keys/${encodeURIComponent(key_id)}`)));

server.tool('deepgram.project.request.list', 'List bounded request-history records for a project. READ.', {
  project_id: ProjectId,
  start: z.string().max(64).optional(),
  end: z.string().max(64).optional(),
  limit: z.number().int().min(1).max(100).default(25),
  page: z.number().int().min(0).max(100000).default(0),
  endpoint: z.enum(['listen', 'read', 'speak', 'agent']).optional(),
  method: z.enum(['sync', 'async', 'streaming']).optional(),
  status: z.enum(['succeeded', 'failed']).optional(),
  request_id: z.string().max(128).optional()
}, async ({ project_id, ...query }) => json(await client.request(`/v1/projects/${encodeURIComponent(project_id)}/requests`, { query })));

server.tool('deepgram.project.usage.fields', 'List usage dimensions observed for a project in a bounded date range. READ.', {
  project_id: ProjectId,
  start: DateOnly.optional(),
  end: DateOnly.optional()
}, async ({ project_id, start, end }) => json(await client.request(`/v1/projects/${encodeURIComponent(project_id)}/usage/fields`, { query: { start, end } })));

server.tool('deepgram.project.usage.breakdown', 'Get project usage breakdown for a bounded date range. READ.', {
  project_id: ProjectId,
  start: DateOnly.optional(),
  end: DateOnly.optional(),
  endpoint: z.enum(['listen', 'read', 'speak', 'agent']).optional(),
  method: z.enum(['sync', 'async', 'streaming']).optional(),
  model: z.string().max(128).optional(),
  tag: z.string().max(200).optional()
}, async ({ project_id, ...query }) => json(await client.request(`/v1/projects/${encodeURIComponent(project_id)}/usage/breakdown`, { query })));

server.tool('deepgram.speech.transcribe_url', 'Transcribe remote prerecorded audio. HIGH_RISK because it sends user-selected data to Deepgram and may incur usage charges; explicit approval is required by default.', {
  audio_url: z.string().url().max(2048),
  ...TranscriptionOptions
}, async ({ audio_url, ...query }) => {
  assertApproval(config, 'deepgram.speech.transcribe_url');
  return json(await client.request('/v1/listen', { method: 'POST', body: { url: validateRemoteAudioUrl(audio_url) }, query, retryable: false }));
});

server.tool('deepgram.speech.transcribe_base64', 'Transcribe bounded base64-encoded prerecorded audio. HIGH_RISK because audio is sent to Deepgram and may incur usage charges; explicit approval is required by default.', {
  audio_base64: z.string().min(4),
  content_type: z.enum(['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/webm', 'audio/flac']),
  ...TranscriptionOptions
}, async ({ audio_base64, content_type, ...query }) => {
  assertApproval(config, 'deepgram.speech.transcribe_base64');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(audio_base64) || audio_base64.length % 4 !== 0) throw new Error('VALIDATION_ERROR: invalid base64 audio');
  const audio = Buffer.from(audio_base64, 'base64');
  if (audio.length === 0 || audio.length > config.maxAudioBytes) throw new Error(`VALIDATION_ERROR: decoded audio must be between 1 and ${config.maxAudioBytes} bytes`);
  return json(await client.request('/v1/listen', { method: 'POST', rawBody: audio, contentType: content_type, query, retryable: false }));
});

await server.connect(new StdioServerTransport());
