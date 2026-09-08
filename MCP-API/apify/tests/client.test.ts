import { afterEach, describe, expect, it, vi } from 'vitest';

describe('ApifyClient', () => {
  afterEach(() => {
    delete process.env.APIFY_TOKEN;
    delete process.env.APIFY_MAX_RETRIES;
    delete process.env.APIFY_TIMEOUT_MS;
    vi.resetModules();
  });

  it('uses bearer authentication without exposing the token in the URL', async () => {
    process.env.APIFY_TOKEN = 'secret-test-token';
    vi.resetModules();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).not.toContain('secret-test-token');
      expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer secret-test-token');
      return new Response(JSON.stringify({ data: { id: 'me' } }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const { ApifyClient } = await import('../src/client.js');
    const client = new ApifyClient(fetchMock as typeof fetch);
    await expect(client.account()).resolves.toEqual({ data: { id: 'me' } });
  });

  it('retries bounded read requests on 429 and honors success after throttle', async () => {
    process.env.APIFY_MAX_RETRIES = '2';
    vi.resetModules();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('{"error":{"message":"slow down"}}', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { ok: true } }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const { ApifyClient } = await import('../src/client.js');
    const client = new ApifyClient(fetchMock as typeof fetch);
    await expect(client.run('run1')).resolves.toEqual({ data: { ok: true } });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry authentication failures', async () => {
    process.env.APIFY_MAX_RETRIES = '5';
    vi.resetModules();
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"error":{"message":"unauthorized"}}', { status: 401 }));
    const { ApifyClient, ApifyError } = await import('../src/client.js');
    const client = new ApifyClient(fetchMock as typeof fetch);
    await expect(client.account()).rejects.toBeInstanceOf(ApifyError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('never retries write operations', async () => {
    process.env.APIFY_MAX_RETRIES = '5';
    vi.resetModules();
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"error":{"message":"temporary"}}', { status: 503 }));
    const { ApifyClient } = await import('../src/client.js');
    const client = new ApifyClient(fetchMock as typeof fetch);
    await expect(client.abortRun('run1')).rejects.toThrow(/503/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('aborts a stalled request at the configured timeout', async () => {
    process.env.APIFY_TIMEOUT_MS = '5';
    process.env.APIFY_MAX_RETRIES = '0';
    vi.resetModules();
    const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(init.signal?.reason ?? new Error('aborted')), { once: true });
    }));
    const { ApifyClient } = await import('../src/client.js');
    const client = new ApifyClient(fetchMock as typeof fetch);
    await expect(client.run('run1')).rejects.toThrow(/timed out/i);
  });
});
