import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { DeepgramApiError, DeepgramClient } from '../src/client.js';
import { assertApproval, loadConfig } from '../src/config.js';

const baseEnv = {
  DEEPGRAM_API_KEY: 'test-key',
  DEEPGRAM_APPROVAL_MODE: 'required',
  DEEPGRAM_APPROVED_ACTIONS: 'deepgram.speech.transcribe_url',
  DEEPGRAM_MAX_AUDIO_BYTES: '1024'
};

describe('configuration and approvals', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('rejects non-HTTPS API origins', () => expect(() => loadConfig({ ...baseEnv, DEEPGRAM_API_BASE_URL: 'http://localhost:8000' })).toThrow(/HTTPS/));
  it('allows an explicitly approved inference action', () => {
    expect(() => assertApproval(loadConfig(baseEnv), 'deepgram.speech.transcribe_url')).not.toThrow();
  });
  it('denies inference without approval', () => {
    expect(() => assertApproval(loadConfig(baseEnv), 'deepgram.speech.transcribe_base64')).toThrow(/APPROVAL_REQUIRED/);
  });
});

describe('DeepgramClient', () => {
  it('keeps the API key in the provider Authorization header', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Token test-key' });
      return new Response(JSON.stringify({ access_token: 'temporary' }), { status: 200 });
    });
    const client = new DeepgramClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v1/auth/token')).resolves.toEqual({ access_token: 'temporary' });
  });

  it('does not retry authorization failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ err_code: 'INVALID_AUTH' }), { status: 401 }));
    const client = new DeepgramClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v1/projects')).rejects.toBeInstanceOf(DeepgramApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ projects: [] }), { status: 200 }));
    const client = new DeepgramClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v1/projects')).resolves.toEqual({ projects: [] });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('does not retry inference POST requests when retryable is false', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: 'busy' }), { status: 503 }));
    const client = new DeepgramClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v1/listen', { method: 'POST', body: { url: 'https://example.com/a.wav' }, retryable: false })).rejects.toBeInstanceOf(DeepgramApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe('tool surface and safety boundaries', () => {
  const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
  const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);

  it('registers the intended provider-scoped tools', () => {
    expect(names).toEqual(expect.arrayContaining([
      'deepgram.auth.validate', 'deepgram.model.list', 'deepgram.model.get',
      'deepgram.project.list', 'deepgram.project.get', 'deepgram.project.model.list',
      'deepgram.project.member.list', 'deepgram.project.key.list', 'deepgram.project.key.get',
      'deepgram.project.request.list', 'deepgram.project.usage.fields', 'deepgram.project.usage.breakdown',
      'deepgram.speech.transcribe_url', 'deepgram.speech.transcribe_base64'
    ]));
    expect(names).toHaveLength(14);
  });

  it('has no generic request escape hatch or credential-creation tool', () => {
    expect(source).not.toContain('execute_any');
    expect(source).not.toContain("server.tool('deepgram.project.key.create'");
    expect(source).not.toContain("server.tool('deepgram.project.delete'");
  });

  it('requires approval for both billable transcription tools', () => {
    expect(source).toContain("assertApproval(config, 'deepgram.speech.transcribe_url')");
    expect(source).toContain("assertApproval(config, 'deepgram.speech.transcribe_base64')");
  });
});
