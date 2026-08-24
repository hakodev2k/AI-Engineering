import { describe, expect, it, vi } from 'vitest';
import { loadConfig, assertModelAllowed, assertSafeRemoteUrl } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { MistralClient, MistralApiError } from '../src/client.js';
import { approvalDigest } from '../src/config.js';

const env = { MISTRAL_API_KEY: 'test-key', MISTRAL_ALLOWED_MODELS: 'mistral-small-latest,mistral-embed' };

describe('configuration and policy', () => {
  it('requires credentials', () => expect(() => loadConfig({})).toThrow(/MISTRAL_API_KEY/));
  it('enforces model allowlist', () => {
    const cfg = loadConfig(env);
    expect(() => assertModelAllowed(cfg, 'mistral-small-latest')).not.toThrow();
    expect(() => assertModelAllowed(cfg, 'other')).toThrow(/not allowed/);
  });
  it('blocks local and private URLs', () => {
    expect(() => assertSafeRemoteUrl('https://example.com/a.pdf')).not.toThrow();
    expect(() => assertSafeRemoteUrl('http://example.com/a.pdf')).toThrow();
    expect(() => assertSafeRemoteUrl('https://127.0.0.1/a.pdf')).toThrow();
    expect(() => assertSafeRemoteUrl('https://192.168.1.3/a.pdf')).toThrow();
  });
  it('requires valid approval when configured', () => {
    const cfg = loadConfig({ ...env, MISTRAL_REQUIRE_APPROVAL_FOR_WRITE: 'true', MISTRAL_APPROVAL_SECRET: 'secret' });
    expect(() => assertApproval(cfg, 'mistral.chat.complete')).toThrow(/approval/i);
    expect(() => assertApproval(cfg, 'mistral.chat.complete', approvalDigest('secret', 'mistral.chat.complete'))).not.toThrow();
  });
});

describe('client', () => {
  it('sends bearer auth and parses successful reads', async () => {
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
      return new Response(JSON.stringify({ data: [{ id: 'mistral-small-latest' }] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new MistralClient(loadConfig(env), fetchMock as typeof fetch);
    await expect(client.get('/v1/models')).resolves.toEqual({ data: [{ id: 'mistral-small-latest' }] });
  });

  it('does not retry billable POST requests', async () => {
    const fetchMock = vi.fn(async () => new Response('busy', { status: 503 }));
    const client = new MistralClient(loadConfig({ ...env, MISTRAL_MAX_RETRIES: '3' }), fetchMock as typeof fetch);
    await expect(client.post('/v1/chat/completions', { model: 'mistral-small-latest' })).rejects.toBeInstanceOf(MistralApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries idempotent GET after throttling', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      return calls === 1 ? new Response('slow', { status: 429, headers: { 'retry-after': '0' } }) : new Response(JSON.stringify({ data: [] }), { status: 200 });
    });
    const client = new MistralClient(loadConfig({ ...env, MISTRAL_MAX_RETRIES: '1' }), fetchMock as typeof fetch);
    await expect(client.get('/v1/models')).resolves.toEqual({ data: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
