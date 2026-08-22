import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { AssemblyAiApiError, AssemblyAiClient } from '../src/client.js';
import { assertActionAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  ASSEMBLYAI_API_KEY: 'test-key',
  ASSEMBLYAI_APPROVAL_MODE: 'required',
  ASSEMBLYAI_APPROVED_ACTIONS: 'assemblyai.transcript.create,assemblyai.llm.analyze_transcript',
  ASSEMBLYAI_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing API key', () => expect(() => loadConfig({})).toThrow());
  it('allows approved writes', () => expect(() => assertActionAllowed(loadConfig(baseEnv), 'assemblyai.transcript.create')).not.toThrow());
  it('denies unapproved writes', () => expect(() => assertActionAllowed(loadConfig(baseEnv), 'assemblyai.transcript.delete')).toThrow(/APPROVAL_REQUIRED/));
  it('keeps destructive actions disabled by default', () => {
    const cfg = loadConfig({ ...baseEnv, ASSEMBLYAI_APPROVED_ACTIONS: 'assemblyai.transcript.delete' });
    expect(() => assertActionAllowed(cfg, 'assemblyai.transcript.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('AssemblyAiClient', () => {
  it('places the API key only in the authorization header', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ authorization: 'test-key' });
      return new Response(JSON.stringify({ page_details: {}, transcripts: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new AssemblyAiClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await client.request('/v2/transcript');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry authentication errors', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } }));
    const client = new AssemblyAiClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v2/transcript')).rejects.toBeInstanceOf(AssemblyAiApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('never retries writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: 'Busy' }), { status: 503, headers: { 'content-type': 'application/json' } }));
    const client = new AssemblyAiClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v2/transcript', { method: 'POST', body: { audio_url: 'https://example.com/a.mp3' } })).rejects.toBeInstanceOf(AssemblyAiApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'rate limited' }), { status: 429, headers: { 'content-type': 'application/json', 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'abc', status: 'completed' }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new AssemblyAiClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v2/transcript/abc')).resolves.toMatchObject({ status: 'completed' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('uses the dedicated LLM Gateway origin when requested', async () => {
    const mockFetch = vi.fn(async (url: URL) => {
      expect(url.origin).toBe('https://llm-gateway.assemblyai.com');
      return new Response(JSON.stringify({ choices: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new AssemblyAiClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await client.request('/v1/chat/completions', { method: 'POST', base: 'llm', body: {} });
  });
});

describe('tool surface', () => {
  it('registers only scoped provider tools', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m => m[1]);
    expect(names).toEqual(expect.arrayContaining([
      'assemblyai.transcript.list', 'assemblyai.transcript.get', 'assemblyai.transcript.create',
      'assemblyai.transcript.wait', 'assemblyai.transcript.paragraphs', 'assemblyai.transcript.sentences',
      'assemblyai.transcript.subtitles', 'assemblyai.transcript.redacted_audio',
      'assemblyai.transcript.delete', 'assemblyai.llm.analyze_transcript'
    ]));
    expect(source).not.toMatch(/execute_any|raw_request|arbitrary_request/);
  });
});
