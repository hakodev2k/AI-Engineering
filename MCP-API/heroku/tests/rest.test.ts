import { describe, expect, it, vi } from 'vitest';
import { HerokuRestClient } from '../src/rest.js';
import type { Config } from '../src/config.js';

const config: Config = {
  apiKey: 'secret', apiBaseUrl: 'https://api.heroku.com', mcpCommand: 'npx', mcpArgs: ['-y','@heroku/mcp-server'],
  useOfficialMcp: true, timeoutMs: 1000, maxRetries: 1, requireWriteApproval: true, approvedActions: new Set()
};

describe('rest client', () => {
  it('keeps credentials in the transport layer', async () => {
    const f = vi.fn(async (_url: any, init: any) => new Response(JSON.stringify({ id: 'x' }), { status: 200 }));
    await new HerokuRestClient(config, f as any).request('GET', '/apps/test');
    expect(f.mock.calls[0][1].headers.Authorization).toBe('Bearer secret');
    expect(f.mock.calls[0][1].headers.Accept).toContain('version=3');
  });

  it('retries safe reads after 429', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'slow' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ remaining: 100 }), { status: 200 }));
    const result = await new HerokuRestClient(config, f as any).request<any>('GET', '/account/rate-limits');
    expect(result.remaining).toBe(100);
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry writes', async () => {
    const f = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'boom' }), { status: 500 }));
    await expect(new HerokuRestClient(config, f as any).request('PATCH', '/apps/a/config-vars', { body: { X: '1' }, retry: false })).rejects.toMatchObject({ status: 500 });
    expect(f).toHaveBeenCalledTimes(1);
  });
});
