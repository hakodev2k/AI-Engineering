import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest, assertModelAllowed } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { OpenRouterClient, OpenRouterError } from '../src/client.js';

describe('OpenRouter configuration', () => {
  it('loads bounded defaults without requiring credentials at startup', () => {
    const c = loadConfig({});
    expect(c.baseUrl).toBe('https://openrouter.ai/api/v1');
    expect(c.timeoutMs).toBe(20000);
    expect(c.maxRetries).toBe(3);
  });

  it('enforces model allowlist', () => {
    const c = loadConfig({ OPENROUTER_ALLOWED_MODELS: 'openai/gpt-5.6-sol,anthropic/claude-sonnet-5' });
    expect(() => assertModelAllowed(c, 'openai/gpt-5.6-sol')).not.toThrow();
    expect(() => assertModelAllowed(c, 'unknown/model')).toThrow(/Model not allowed/);
  });
});

describe('approval policy', () => {
  it('requires valid approval for spend-producing inference', () => {
    const secret = 'test-secret';
    expect(() => assertApproval('openrouter.inference.chat', undefined, secret)).toThrow(/Explicit approval/);
    expect(() => assertApproval('openrouter.inference.chat', approvalDigest(secret, 'openrouter.inference.chat'), secret)).not.toThrow();
  });

  it('requires approval for stored generation content', () => {
    expect(() => assertApproval('openrouter.generation.content.get', undefined, 'secret')).toThrow(/Explicit approval/);
  });
});

describe('HTTP reliability and auth isolation', () => {
  it('sends bearer auth and parses JSON', async () => {
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect((init?.headers as Record<string,string>).Authorization).toBe('Bearer test-key');
      return new Response(JSON.stringify({ data: [{ id: 'x' }] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
    const c = loadConfig({ OPENROUTER_API_KEY: 'test-key', OPENROUTER_MAX_RETRIES: '0' });
    const client = new OpenRouterClient(c, fetchMock as unknown as typeof fetch);
    expect(await client.get('/models', c.apiKey)).toEqual({ data: [{ id: 'x' }] });
  });

  it('maps provider errors without leaking credentials', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ error: 'bad request' }), { status: 400 }));
    const c = loadConfig({ OPENROUTER_API_KEY: 'super-secret', OPENROUTER_MAX_RETRIES: '0' });
    const client = new OpenRouterClient(c, fetchMock as unknown as typeof fetch);
    try {
      await client.get('/generation', c.apiKey, { id: 'bad' });
      throw new Error('expected error');
    } catch (err) {
      expect(err).toBeInstanceOf(OpenRouterError);
      expect(String(err)).not.toContain('super-secret');
    }
  });

  it('retries safe GET throttling but not spend-producing POST', async () => {
    const getMock = vi.fn()
      .mockResolvedValueOnce(new Response('throttled', { status: 429 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const c = loadConfig({ OPENROUTER_API_KEY: 'k', OPENROUTER_MAX_RETRIES: '1' });
    const getClient = new OpenRouterClient(c, getMock as unknown as typeof fetch);
    expect(await getClient.get('/models', 'k')).toEqual({ ok: true });
    expect(getMock).toHaveBeenCalledTimes(2);

    const postMock = vi.fn(async () => new Response('throttled', { status: 429 }));
    const postClient = new OpenRouterClient(c, postMock as unknown as typeof fetch);
    await expect(postClient.post('/chat/completions', 'k', { model: 'x' }, false)).rejects.toBeInstanceOf(OpenRouterError);
    expect(postMock).toHaveBeenCalledTimes(1);
  });
});
