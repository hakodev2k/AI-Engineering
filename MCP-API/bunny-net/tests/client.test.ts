import { afterEach, describe, expect, it, vi } from 'vitest';
import { BunnyClient, BunnyError } from '../src/client.js';

const response = (status: number, body: unknown, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers });

describe('BunnyClient', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requires an API key', () => {
    expect(() => new BunnyClient('', 'https://api.bunny.net')).toThrow(/BUNNY_API_KEY/);
  });

  it('requires HTTPS for the API base URL', () => {
    expect(() => new BunnyClient('key', 'http://api.bunny.net')).toThrow(/HTTPS/);
  });

  it('parses a successful read response', async () => {
    const fetchMock = vi.fn(async () => response(200, [{ Id: 1 }]));
    const client = new BunnyClient('key', 'https://api.bunny.net', 1000, 0, fetchMock as typeof fetch);
    expect(await client.request('GET', '/pullzone')).toEqual([{ Id: 1 }]);
  });

  it('retries bounded transient read errors', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(503, { Message: 'temporary' }))
      .mockResolvedValueOnce(response(200, { Id: 1 }));
    const client = new BunnyClient('key', 'https://api.bunny.net', 1000, 1, fetchMock as typeof fetch);
    await expect(client.request('GET', '/pullzone/1')).resolves.toEqual({ Id: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry mutating calls', async () => {
    const fetchMock = vi.fn(async () => response(503, { Message: 'failed' }));
    const client = new BunnyClient('key', 'https://api.bunny.net', 1000, 3, fetchMock as typeof fetch);
    await expect(client.request('DELETE', '/pullzone/1', undefined, false)).rejects.toBeInstanceOf(BunnyError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves Retry-After on throttling', async () => {
    const fetchMock = vi.fn(async () => response(429, { Message: 'limited' }, { 'Retry-After': '3' }));
    const client = new BunnyClient('key', 'https://api.bunny.net', 1000, 0, fetchMock as typeof fetch);
    try {
      await client.request('GET', '/pullzone');
      throw new Error('expected failure');
    } catch (error) {
      expect(error).toBeInstanceOf(BunnyError);
      expect((error as BunnyError).code).toBe('rate_limited');
      expect((error as BunnyError).retryAfterMs).toBe(3000);
    }
  });
});
