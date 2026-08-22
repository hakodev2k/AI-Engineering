import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { AssemblyAiClient } from './client.js';
import { assertActionAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new AssemblyAiClient(config);
const server = new McpServer({ name: 'assemblyai-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] });
const TranscriptId = z.string().min(8).max(128).regex(/^[A-Za-z0-9_-]+$/);

server.tool('assemblyai.transcript.list', 'List historical transcripts with bounded pagination. READ.', {
  limit: z.number().int().min(1).max(100).default(25),
  status: z.enum(['queued', 'processing', 'completed', 'error']).optional(),
  before_id: TranscriptId.optional(),
  after_id: TranscriptId.optional()
}, async (args) => json(await client.request('/v2/transcript', { query: args })));

server.tool('assemblyai.transcript.get', 'Get transcript metadata, status, text, words, utterances, and configured analysis fields. READ.', {
  transcript_id: TranscriptId
}, async ({ transcript_id }) => json(await client.request(`/v2/transcript/${encodeURIComponent(transcript_id)}`)));

server.tool('assemblyai.transcript.create', 'Submit a public HTTPS audio/video URL for asynchronous transcription. WRITE; approval required by default.', {
  audio_url: z.string().url().refine(v => new URL(v).protocol === 'https:', 'audio_url must use HTTPS'),
  language_code: z.string().min(2).max(12).optional(),
  language_detection: z.boolean().optional(),
  speaker_labels: z.boolean().optional(),
  punctuate: z.boolean().optional(),
  format_text: z.boolean().optional(),
  filter_profanity: z.boolean().optional(),
  redact_pii: z.boolean().optional(),
  redact_pii_policies: z.array(z.string().min(1).max(64)).max(50).optional(),
  redact_pii_audio: z.boolean().optional(),
  webhook_url: z.string().url().refine(v => new URL(v).protocol === 'https:', 'webhook_url must use HTTPS').optional()
}, async (body) => {
  assertActionAllowed(config, 'assemblyai.transcript.create');
  if (body.redact_pii_audio && !body.redact_pii) throw new Error('VALIDATION_ERROR: redact_pii_audio requires redact_pii=true');
  return json(await client.request('/v2/transcript', { method: 'POST', body }));
});

server.tool('assemblyai.transcript.wait', 'Poll a transcript until completed/error or until a bounded timeout expires. READ.', {
  transcript_id: TranscriptId,
  poll_interval_ms: z.number().int().min(1000).max(10000).default(3000),
  timeout_ms: z.number().int().min(1000).max(120000).default(60000)
}, async ({ transcript_id, poll_interval_ms, timeout_ms }) => {
  const deadline = Date.now() + timeout_ms;
  while (true) {
    const result = await client.request<any>(`/v2/transcript/${encodeURIComponent(transcript_id)}`);
    if (result?.status === 'completed' || result?.status === 'error') return json(result);
    if (Date.now() >= deadline) return json({ id: transcript_id, status: result?.status ?? 'unknown', timed_out: true });
    await new Promise(resolve => setTimeout(resolve, poll_interval_ms));
  }
});

server.tool('assemblyai.transcript.paragraphs', 'Get a completed transcript segmented into paragraphs. READ.', {
  transcript_id: TranscriptId
}, async ({ transcript_id }) => json(await client.request(`/v2/transcript/${encodeURIComponent(transcript_id)}/paragraphs`)));

server.tool('assemblyai.transcript.sentences', 'Get a completed transcript segmented into sentences. READ.', {
  transcript_id: TranscriptId
}, async ({ transcript_id }) => json(await client.request(`/v2/transcript/${encodeURIComponent(transcript_id)}/sentences`)));

server.tool('assemblyai.transcript.subtitles', 'Get SRT or VTT subtitles for a completed transcript. READ.', {
  transcript_id: TranscriptId,
  format: z.enum(['srt', 'vtt'])
}, async ({ transcript_id, format }) => json(await client.request<string>(`/v2/transcript/${encodeURIComponent(transcript_id)}/${format}`, { accept: 'text/plain' })));

server.tool('assemblyai.transcript.redacted_audio', 'Get status and temporary URL for PII-redacted audio generated during transcription. READ.', {
  transcript_id: TranscriptId
}, async ({ transcript_id }) => json(await client.request(`/v2/transcript/${encodeURIComponent(transcript_id)}/redacted-audio`)));

server.tool('assemblyai.transcript.delete', 'Permanently delete a transcript. DESTRUCTIVE; approval plus destructive enablement required.', {
  transcript_id: TranscriptId
}, async ({ transcript_id }) => {
  assertActionAllowed(config, 'assemblyai.transcript.delete', true);
  return json(await client.request(`/v2/transcript/${encodeURIComponent(transcript_id)}`, { method: 'DELETE' }));
});

server.tool('assemblyai.llm.analyze_transcript', 'Analyze an existing transcript through AssemblyAI LLM Gateway. WRITE/COST; approval required by default.', {
  transcript_id: TranscriptId,
  model: z.string().min(1).max(100),
  prompt: z.string().min(1).max(12000),
  max_tokens: z.number().int().min(1).max(8000).default(1000),
  temperature: z.number().min(0).max(2).optional()
}, async ({ transcript_id, model, prompt, max_tokens, temperature }) => {
  assertActionAllowed(config, 'assemblyai.llm.analyze_transcript');
  const body = {
    model,
    messages: [{ role: 'user', content: `${prompt}\n\n{{ transcript }}` }],
    transcript_id,
    max_tokens,
    ...(temperature === undefined ? {} : { temperature })
  };
  return json(await client.request('/v1/chat/completions', { method: 'POST', base: 'llm', body }));
});

await server.connect(new StdioServerTransport());
