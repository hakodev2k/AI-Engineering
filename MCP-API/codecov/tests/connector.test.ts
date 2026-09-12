import { describe, expect, it, vi } from 'vitest';
import { CodecovClient, CodecovError } from '../src/client.js';
import { loadConfig } from '../src/config.js';

describe('Codecov connector', () => {
  it('requires an API token and HTTPS base URL', () => {
    expect(() => loadConfig({})).toThrow(/CODECOV_API_TOKEN/);
    expect(() => loadConfig({ CODECOV_API_TOKEN: 'x', CODECOV_API_BASE_URL: 'http://example.test/api/v2' })).toThrow(/HTTPS/);
  });

  it('sends bearer credentials only to the configured Codecov origin and returns JSON', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe('https://api.codecov.io/api/v2/github/acme/repos/widget/');
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer secret');
      return new Response(JSON.stringify({ name: 'widget' }), { status: 200 });
    });
    const client = new CodecovClient({ apiToken: 'secret', baseUrl: 'https://api.codecov.io/api/v2', timeoutMs: 1000, maxRetries: 0 }, fetchMock as typeof fetch);
    await expect(client.get('/github/acme/repos/widget/')).resolves.toEqual({ name: 'widget' });
  });

  it('does not retry validation/auth failures', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ detail: 'bad token' }), { status: 401 }));
    const client = new CodecovClient({ apiToken: 'bad', baseUrl: 'https://api.codecov.io/api/v2', timeoutMs: 1000, maxRetries: 2 }, fetchMock as typeof fetch);
    await expect(client.get('/github/acme/repos/widget/')).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries bounded 5xx responses and maps the final provider error', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ detail: 'busy' }), { status: 503 }));
    const client = new CodecovClient({ apiToken: 'x', baseUrl: 'https://api.codecov.io/api/v2', timeoutMs: 1000, maxRetries: 1 }, fetchMock as typeof fetch);
    await expect(client.get('/github/acme/repos/widget/')).rejects.toBeInstanceOf(CodecovError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('honors Retry-After on rate limiting', async () => {
    let n = 0;
    const fetchMock = vi.fn(async () => {
      n++;
      if (n === 1) return new Response(JSON.stringify({ detail: 'slow down' }), { status: 429, headers: { 'retry-after': '0' } });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    const client = new CodecovClient({ apiToken: 'x', baseUrl: 'https://api.codecov.io/api/v2', timeoutMs: 1000, maxRetries: 1 }, fetchMock as typeof fetch);
    await expect(client.get('/github/acme/repos/widget/')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('times out a hanging request', async () => {
    const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
    }));
    const client = new CodecovClient({ apiToken: 'x', baseUrl: 'https://api.codecov.io/api/v2', timeoutMs: 5, maxRetries: 0 }, fetchMock as typeof fetch);
    await expect(client.get('/github/acme/repos/widget/')).rejects.toThrow();
  });
});
