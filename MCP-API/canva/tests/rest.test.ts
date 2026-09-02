import { describe, expect, it, vi } from 'vitest';
import { CanvaRestClient } from '../src/rest.js';
import type { CanvaConfig } from '../src/config.js';

const config: CanvaConfig = {
  accessToken: 'secret-token', apiBaseUrl: 'https://api.canva.com/rest/v1', mcpUrl: 'https://mcp.canva.com/mcp',
  timeoutMs: 1000, maxRetries: 1, requireWriteApproval: true, approvedActions: new Set(),
};
const credentials = { getAccessToken: vi.fn(async () => 'secret-token'), invalidateAccessToken: vi.fn() } as any;

describe('CanvaRestClient', () => {
  it('places credentials only in the Authorization header', async () => {
    const f = vi.fn(async (_url: any, init: any) => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const client = new CanvaRestClient(config, credentials, f as any);
    await client.request('GET', '/users/me/profile');
    expect(f.mock.calls[0][1].headers.Authorization).toBe('Bearer secret-token');
    expect(String(f.mock.calls[0][0])).not.toContain('secret-token');
  });

  it('retries a throttled read with bounded retry', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ code: 'rate_limited', message: 'slow down' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const client = new CanvaRestClient(config, credentials, f as any);
    await expect(client.request<any>('GET', '/designs')).resolves.toEqual({ ok: true });
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry a mutating request', async () => {
    const f = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'failure' }), { status: 500 }));
    const client = new CanvaRestClient(config, credentials, f as any);
    await expect(client.request('POST', '/designs', { body: {}, retry: false })).rejects.toMatchObject({ status: 500 });
    expect(f).toHaveBeenCalledTimes(1);
  });
});
