import { afterEach, describe, expect, it, vi } from 'vitest';
import { authorize } from '../src/policy.js';
import { loadConfig } from '../src/config.js';
import { NgrokApiError, NgrokClient } from '../src/client.js';

const originalEnv = { ...process.env };
afterEach(() => {
  process.env = { ...originalEnv };
  vi.restoreAllMocks();
});

describe('configuration', () => {
  it('requires an API key', () => {
    delete process.env.NGROK_API_KEY;
    expect(() => loadConfig()).toThrow('NGROK_API_KEY is required');
  });

  it('rejects non-official API origins', () => {
    process.env.NGROK_API_KEY = 'test';
    process.env.NGROK_API_BASE = 'https://example.com';
    expect(() => loadConfig()).toThrow('NGROK_API_BASE must be https://api.ngrok.com');
  });
});

describe('approval policy', () => {
  const cfg = { requireWriteApproval: true, destructiveEnabled: false };

  it('allows reads without approval', () => expect(() => authorize('READ', undefined, cfg)).not.toThrow());
  it('denies writes without approval', () => expect(() => authorize('WRITE', undefined, cfg)).toThrow());
  it('allows approved writes', () => expect(() => authorize('WRITE', true, cfg)).not.toThrow());
  it('keeps destructive operations disabled by default', () => expect(() => authorize('DESTRUCTIVE', true, cfg)).toThrow('disabled'));
  it('requires approval even when destructive mode is enabled', () => expect(() => authorize('DESTRUCTIVE', false, { ...cfg, destructiveEnabled: true })).toThrow('approval'));
});

describe('API client', () => {
  const cfg = {
    apiKey: 'secret-test-key', apiBase: 'https://api.ngrok.com', apiVersion: '2', timeoutMs: 2000,
    requireWriteApproval: true, destructiveEnabled: false
  };

  it('sends auth/version headers and parses successful reads', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ endpoints: [] }), {
      status: 200, headers: { 'content-type': 'application/json' }
    }));
    const client = new NgrokClient(cfg);
    const value = await client.request('GET', '/endpoints', undefined, { limit: 10 });
    expect(value).toEqual({ endpoints: [] });
    const [, init] = fetchMock.mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer secret-test-key');
    expect(headers['ngrok-version']).toBe('2');
  });

  it('does not retry writes', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ msg: 'busy' }), { status: 503 }));
    const client = new NgrokClient(cfg);
    await expect(client.request('POST', '/endpoints', { url: 'https://x.ngrok.app' })).rejects.toBeInstanceOf(NgrokApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries throttled reads with a bounded retry count', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ msg: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ endpoints: [] }), { status: 200 }));
    const client = new NgrokClient(cfg);
    await expect(client.request('GET', '/endpoints')).resolves.toEqual({ endpoints: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('surfaces authentication failures without retrying', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ msg: 'invalid API key' }), { status: 401 }));
    const client = new NgrokClient(cfg);
    await expect(client.request('GET', '/endpoints')).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
