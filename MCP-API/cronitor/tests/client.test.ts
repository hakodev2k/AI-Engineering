import { describe, expect, it, vi } from 'vitest';
import { CronitorClient } from '../src/client.js';
import type { Config } from '../src/config.js';

const config: Config = {
  apiKey: 'test-key', telemetryKey: 'telemetry-key', apiBase: 'https://cronitor.io/api', telemetryBase: 'https://cronitor.link', apiVersion: '2025-11-28', requireWriteApproval: true, enableDestructive: false, timeoutMs: 2000
};

describe('CronitorClient', () => {
  it('sends Basic auth and dated API version', async () => {
    const fakeFetch = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })) as unknown as typeof fetch;
    const client = new CronitorClient(config, fakeFetch);
    await client.request('/monitors');
    const init = fakeFetch.mock.calls[0]?.[1] as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.get('Authorization')).toBe(`Basic ${Buffer.from('test-key:').toString('base64')}`);
    expect(headers.get('Cronitor-Version')).toBe('2025-11-28');
  });

  it('does not retry validation failures', async () => {
    const fakeFetch = vi.fn(async () => new Response('{"detail":"bad"}', { status: 400 })) as unknown as typeof fetch;
    const client = new CronitorClient(config, fakeFetch);
    await expect(client.request('/monitors')).rejects.toThrow();
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it('retries transient 500 responses with a bound', async () => {
    const fakeFetch = vi.fn()
      .mockResolvedValueOnce(new Response('oops', { status: 500 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const client = new CronitorClient(config, fakeFetch as unknown as typeof fetch);
    await expect(client.request('/monitors')).resolves.toEqual({ ok: true });
    expect(fakeFetch).toHaveBeenCalledTimes(2);
  });

  it('uses telemetry endpoint without exposing keys in output', async () => {
    const fakeFetch = vi.fn(async () => new Response('', { status: 200 })) as unknown as typeof fetch;
    const client = new CronitorClient(config, fakeFetch);
    await expect(client.sendTelemetry('job-1', 'ok', 'healthy')).resolves.toEqual({ accepted: true });
    const calledUrl = String(fakeFetch.mock.calls[0]?.[0]);
    expect(calledUrl).toContain('/p/telemetry-key/job-1?');
  });
});
