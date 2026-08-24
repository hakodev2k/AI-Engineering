import { describe, expect, it, vi } from 'vitest';
import { loadConfig, assertModelAllowed } from '../src/config.js';
import { approvalDigest, assertApproval, assertCostingWriteEnabled, assertFineTuningEnabled } from '../src/policy.js';
import { TogetherApiError, TogetherClient } from '../src/client.js';

const baseEnv = { TOGETHER_API_KEY: 'test-key' } as NodeJS.ProcessEnv;

describe('configuration and policy', () => {
  it('requires an API key', () => expect(() => loadConfig({})).toThrow(/TOGETHER_API_KEY/));

  it('validates retry and timeout bounds', () => {
    expect(() => loadConfig({ ...baseEnv, TOGETHER_MAX_RETRIES: '9' })).toThrow(/MAX_RETRIES/);
    expect(() => loadConfig({ ...baseEnv, TOGETHER_TIMEOUT_MS: '10' })).toThrow(/TIMEOUT/);
  });

  it('enforces the model allowlist', () => {
    const config = loadConfig({ ...baseEnv, TOGETHER_ALLOWED_MODELS: 'model/a,model/b' });
    expect(() => assertModelAllowed(config, 'model/a')).not.toThrow();
    expect(() => assertModelAllowed(config, 'model/c')).toThrow(/not allowed/);
  });

  it('requires costing-write and fine-tuning feature flags', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertCostingWriteEnabled(config, 'x')).toThrow(/disabled/);
    expect(() => assertFineTuningEnabled(config, 'y')).toThrow(/disabled/);
  });

  it('verifies approval with timing-safe HMAC token', () => {
    const token = approvalDigest('secret', 'together.chat.complete');
    expect(() => assertApproval('together.chat.complete', token, 'secret')).not.toThrow();
    expect(() => assertApproval('together.chat.complete', '0'.repeat(64), 'secret')).toThrow(/Invalid approval/);
  });
});

describe('TogetherClient', () => {
  it('sends bearer credentials without exposing them in the body', async () => {
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
      expect(init?.body).toBe(JSON.stringify({ model: 'm', input: 'x' }));
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new TogetherClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await expect(client.post('/embeddings', { model: 'm', input: 'x' })).resolves.toEqual({ ok: true });
  });

  it('maps API failures and preserves Retry-After', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ error: { message: 'bad' } }), { status: 429, headers: { 'retry-after': '7' } }));
    const client = new TogetherClient(loadConfig({ ...baseEnv, TOGETHER_MAX_RETRIES: '0' }), fetchMock as typeof fetch);
    try {
      await client.get('/models');
      throw new Error('expected failure');
    } catch (error) {
      expect(error).toBeInstanceOf(TogetherApiError);
      expect((error as TogetherApiError).status).toBe(429);
      expect((error as TogetherApiError).retryAfter).toBe(7);
    }
  });

  it('retries bounded GET throttling but never blindly retries POST', async () => {
    const getMock = vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'm' }]), { status: 200 }));
    const getClient = new TogetherClient(loadConfig({ ...baseEnv, TOGETHER_MAX_RETRIES: '1' }), getMock as typeof fetch);
    await expect(getClient.get('/models')).resolves.toEqual([{ id: 'm' }]);
    expect(getMock).toHaveBeenCalledTimes(2);

    const postMock = vi.fn(async () => new Response('{}', { status: 503 }));
    const postClient = new TogetherClient(loadConfig({ ...baseEnv, TOGETHER_MAX_RETRIES: '5' }), postMock as typeof fetch);
    await expect(postClient.post('/chat/completions', {})).rejects.toBeInstanceOf(TogetherApiError);
    expect(postMock).toHaveBeenCalledTimes(1);
  });
});
