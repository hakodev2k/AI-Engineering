import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { AssemblyAIClient, AssemblyAIError } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const env = {
  ASSEMBLYAI_API_KEY: 'test-key',
  ASSEMBLYAI_APPROVAL_MODE: 'required',
  ASSEMBLYAI_APPROVED_ACTIONS: 'assemblyai.transcript.create',
  ASSEMBLYAI_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval', () => {
  it('requires an API key', () => expect(() => loadConfig({})).toThrow());
  it('allows explicitly approved create', () => expect(() => assertWriteAllowed(loadConfig(env), 'assemblyai.transcript.create')).not.toThrow());
  it('denies unapproved writes', () => expect(() => assertWriteAllowed(loadConfig(env), 'assemblyai.transcript.delete')).toThrow(/APPROVAL_REQUIRED/));
  it('keeps destructive actions disabled by default', () => {
    const cfg = loadConfig({ ...env, ASSEMBLYAI_APPROVED_ACTIONS: 'assemblyai.transcript.delete' });
    expect(() => assertWriteAllowed(cfg, 'assemblyai.transcript.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('AssemblyAIClient', () => {
  it('keeps the credential in the authorization header', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ authorization: 'test-key' });
      return new Response(JSON.stringify({ id: 'abc', status: 'completed' }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new AssemblyAIClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v2/transcript/abc')).resolves.toMatchObject({ id: 'abc' });
  });

  it('does not retry authorization failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } }));
    const client = new AssemblyAIClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v2/transcript/abc')).rejects.toBeInstanceOf(AssemblyAIError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded GET throttling', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'rate limited' }), { status: 429, headers: { 'retry-after': '0', 'content-type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ transcripts: [] }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new AssemblyAIClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v2/transcript')).resolves.toMatchObject({ transcripts: [] });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('never automatically retries writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: 'busy' }), { status: 503, headers: { 'content-type': 'application/json' } }));
    const client = new AssemblyAIClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v2/transcript', { method: 'POST', body: { audio_url: 'https://example.com/a.mp3' } })).rejects.toBeInstanceOf(AssemblyAIError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe('tool registration', () => {
  it('registers scoped tools and no generic request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m => m[1]);
    expect(names).toEqual(expect.arrayContaining([
      'assemblyai.transcript.create', 'assemblyai.transcript.get', 'assemblyai.transcript.list',
      'assemblyai.transcript.sentences', 'assemblyai.transcript.paragraphs', 'assemblyai.transcript.word_search',
      'assemblyai.subtitle.srt', 'assemblyai.subtitle.vtt', 'assemblyai.transcript.delete'
    ]));
    expect(source).not.toContain('execute_any_api_request');
  });
});
