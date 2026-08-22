import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { AssemblyAIClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new AssemblyAIClient(config);
const server = new McpServer({ name: 'assemblyai-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] });
const TranscriptId = z.string().min(1).max(128).regex(/^[A-Za-z0-9-]+$/);

server.tool('assemblyai.transcript.create', 'Create an asynchronous transcript from a provider-accessible audio/video URL. WRITE; approval required by default.', {
  audio_url: z.string().url(),
  speech_model: z.string().min(1).max(100).optional(),
  language_code: z.string().min(2).max(16).optional(),
  language_detection: z.boolean().optional(),
  speaker_labels: z.boolean().optional(),
  multichannel: z.boolean().optional(),
  punctuate: z.boolean().optional(),
  format_text: z.boolean().optional(),
  filter_profanity: z.boolean().optional(),
  auto_highlights: z.boolean().optional(),
  redact_pii: z.boolean().optional(),
  webhook_url: z.string().url().optional()
}, async (body) => {
  assertWriteAllowed(config, 'assemblyai.transcript.create');
  return json(await client.request('/v2/transcript', { method: 'POST', body }));
});

server.tool('assemblyai.transcript.get', 'Get one transcript and its status/results. READ.', { transcript_id: TranscriptId },
  async ({ transcript_id }) => json(await client.request(`/v2/transcript/${transcript_id}`)));

server.tool('assemblyai.transcript.list', 'List historical transcripts with bounded pagination. READ.', {
  limit: z.number().int().min(1).max(100).default(25),
  status: z.enum(['queued', 'processing', 'completed', 'error']).optional(),
  created_on: z.string().max(64).optional(),
  before_id: TranscriptId.optional(),
  after_id: TranscriptId.optional()
}, async (args) => json(await client.request('/v2/transcript', { query: args })));

server.tool('assemblyai.transcript.sentences', 'Return a completed transcript segmented into sentences. READ.', { transcript_id: TranscriptId },
  async ({ transcript_id }) => json(await client.request(`/v2/transcript/${transcript_id}/sentences`)));

server.tool('assemblyai.transcript.paragraphs', 'Return a completed transcript segmented into paragraphs. READ.', { transcript_id: TranscriptId },
  async ({ transcript_id }) => json(await client.request(`/v2/transcript/${transcript_id}/paragraphs`)));

server.tool('assemblyai.transcript.word_search', 'Search a completed transcript for exact words or phrases. READ.', {
  transcript_id: TranscriptId,
  words: z.array(z.string().min(1).max(200)).min(1).max(50)
}, async ({ transcript_id, words }) => json(await client.request(`/v2/transcript/${transcript_id}/word-search`, { query: { words: words.join(',') } })));

server.tool('assemblyai.subtitle.srt', 'Export SRT subtitles for a completed transcript. READ.', {
  transcript_id: TranscriptId,
  chars_per_caption: z.number().int().min(1).max(1000).optional()
}, async ({ transcript_id, chars_per_caption }) => json(await client.request<string>(`/v2/transcript/${transcript_id}/srt`, { query: { chars_per_caption }, accept: 'text/plain' })));

server.tool('assemblyai.subtitle.vtt', 'Export WebVTT subtitles for a completed transcript. READ.', {
  transcript_id: TranscriptId,
  chars_per_caption: z.number().int().min(1).max(1000).optional()
}, async ({ transcript_id, chars_per_caption }) => json(await client.request<string>(`/v2/transcript/${transcript_id}/vtt`, { query: { chars_per_caption }, accept: 'text/plain' })));

server.tool('assemblyai.transcript.delete', 'Delete a transcript and associated stored transcript data. DESTRUCTIVE; disabled by default and requires explicit approval.', {
  transcript_id: TranscriptId
}, async ({ transcript_id }) => {
  assertWriteAllowed(config, 'assemblyai.transcript.delete', true);
  return json(await client.request(`/v2/transcript/${transcript_id}`, { method: 'DELETE' }));
});

await server.connect(new StdioServerTransport());
