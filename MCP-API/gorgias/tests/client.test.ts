import { describe, expect, it, vi } from 'vitest';
import { GorgiasClient } from '../src/client.js';
import type { GorgiasConfig } from '../src/config.js';

const base: GorgiasConfig = {
  subdomain: 'shop', apiBaseUrl: 'https://shop.gorgias.com/api', timeoutMs: 1000, maxRetries: 1,
  requireWriteApproval: true, approvedActions: new Set(), auth: { type: 'bearer', accessToken: 'secret' }
};

describe('GorgiasClient', () => {
  it('keeps bearer credentials in the transport layer', async () => {
    const f = vi.fn(async (_url: any, init: any) => new Response(JSON.stringify({ id: 1 }), { status: 200 }));
    await new GorgiasClient(base, f as any).request('GET', '/account');
    expect(f.mock.calls[0][1].headers.Authorization).toBe('Bearer secret');
  });

  it('uses Basic auth for private API keys', async () => {
    const config: GorgiasConfig = { ...base, auth: { type: 'basic', email: 'agent@example.com', apiKey: 'abc' } };
    const f = vi.fn(async (_url: any, init: any) => new Response('{}', { status: 200 }));
    await new GorgiasClient(config, f as any).request('GET', '/account');
    expect(f.mock.calls[0][1].headers.Authorization).toBe(`Basic ${Buffer.from('agent@example.com:abc').toString('base64')}`);
  });

  it('retries 429 for safe reads using Retry-After', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ detail: 'slow down' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [1] }), { status: 200 }));
    const result = await new GorgiasClient(base, f as any).request<any>('GET', '/tickets');
    expect(result.data).toEqual([1]);
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry writes', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ detail: 'server error' }), { status: 500 }));
    const client = new GorgiasClient(base, f as any);
    await expect(client.request('POST', '/tickets', { body: {}, retry: false })).rejects.toMatchObject({ status: 500 });
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('paginates through cursors with a hard page cap', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [1], meta: { next_cursor: 'next' } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [2], meta: {} }), { status: 200 }));
    const result = await new GorgiasClient(base, f as any).paginate<number>('/tickets');
    expect(result).toEqual([1, 2]);
  });
});
