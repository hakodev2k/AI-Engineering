import { describe, expect, it, vi } from 'vitest';
import { RootlyRestClient } from '../src/rest.js';
import type { Config } from '../src/config.js';

const config: Config = { apiToken: 'rootly_secret', apiBaseUrl: 'https://api.rootly.com/v1', mcpUrl: 'https://mcp.rootly.com/mcp?tool_profile=slim', timeoutMs: 1000, maxRetries: 1 };

describe('REST client', () => {
  it('isolates the credential in the Authorization header', async () => {
    const mock = vi.fn(async (_url: any, init: any) => new Response(JSON.stringify({ data: [] }), { status: 200 }));
    const api = new RootlyRestClient(config, mock as any);
    await api.get('/incidents');
    expect(mock.mock.calls[0][1].headers.Authorization).toBe('Bearer rootly_secret');
  });

  it('retries rate-limited reads with bounded retry', async () => {
    const mock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    const api = new RootlyRestClient(config, mock as any);
    await expect(api.get('/incidents')).resolves.toEqual({ data: [] });
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('does not retry authorization errors', async () => {
    const mock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 }));
    const api = new RootlyRestClient(config, mock as any);
    await expect(api.get('/incidents')).rejects.toMatchObject({ status: 401 });
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
