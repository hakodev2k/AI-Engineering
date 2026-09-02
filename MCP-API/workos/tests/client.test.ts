import { describe, expect, it, vi } from 'vitest';
import { WorkOSClient } from '../src/client.js';
import type { Config } from '../src/config.js';

const config: Config = { apiKey: 'sk_secret', apiBaseUrl: 'https://api.workos.com', timeoutMs: 1000, maxRetries: 1, requireWriteApproval: true, approvedActions: new Set() };

describe('WorkOS REST client', () => {
  it('isolates the credential in Authorization', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ object: 'list', data: [] }), { status: 200 }));
    await new WorkOSClient(config, f as any).request('GET', '/organizations');
    const init = f.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string,string>).Authorization).toBe('Bearer sk_secret');
  });
  it('retries 429 only for safe reads', async () => {
    const f = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ message: 'slow' }), { status: 429, headers: { 'retry-after': '0' } })).mockResolvedValueOnce(new Response('{}', { status: 200 }));
    await new WorkOSClient(config, f as any).request('GET', '/organizations');
    expect(f).toHaveBeenCalledTimes(2);
  });
  it('does not retry a write', async () => {
    const f = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'error' }), { status: 500 }));
    await expect(new WorkOSClient(config, f as any).request('POST', '/organizations', { body: { name: 'A' }, retry: false })).rejects.toMatchObject({ status: 500 });
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('serializes array filters as repeated parameters', async () => {
    const f = vi.fn(async () => new Response('{}', { status: 200 }));
    await new WorkOSClient(config, f as any).request('GET', '/organizations', { query: { domains: ['a.com','b.com'] } });
    expect(new URL(String(f.mock.calls[0][0])).searchParams.getAll('domains')).toEqual(['a.com','b.com']);
  });
});
