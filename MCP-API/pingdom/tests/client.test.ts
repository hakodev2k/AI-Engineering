import { describe, expect, it, vi } from 'vitest';
import { PingdomClient, PingdomError } from '../src/client.js';
import type { Config } from '../src/config.js';

const config: Config = { apiToken: 'secret-token', apiBaseUrl: 'https://api.pingdom.com/api/3.1', timeoutMs: 1000, maxReadRetries: 1, approvalSecret: 'x'.repeat(32), enableDestructive: false };

describe('PingdomClient', () => {
  it('sends bearer authentication and returns provider content as untrusted data', async () => {
    const fetchFn = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string,string>).Authorization).toBe('Bearer secret-token');
      return new Response(JSON.stringify({ checks: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new PingdomClient(config, fetchFn);
    await expect(client.request('GET', '/checks')).resolves.toMatchObject({ source: 'pingdom', untrusted: true, status: 200 });
  });

  it('retries bounded read throttling but not writes', async () => {
    let calls = 0;
    const fetchFn = vi.fn(async () => {
      calls++;
      return calls === 1 ? new Response('{"error":"rate"}', { status: 429, headers: { 'retry-after': '0' } }) : new Response('{}', { status: 200 });
    }) as unknown as typeof fetch;
    const client = new PingdomClient(config, fetchFn);
    await client.request('GET', '/checks');
    expect(calls).toBe(2);

    const always429 = vi.fn(async () => new Response('{}', { status: 429 })) as unknown as typeof fetch;
    const writer = new PingdomClient(config, always429);
    await expect(writer.request('POST', '/maintenance', { body: { description: 'x', from: 1, to: 2 } })).rejects.toBeInstanceOf(PingdomError);
    expect(always429).toHaveBeenCalledTimes(1);
  });
});
