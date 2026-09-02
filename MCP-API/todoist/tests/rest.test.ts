import { describe, expect, it, vi } from 'vitest';
import { TodoistRestClient } from '../src/rest.js';
import type { Config } from '../src/config.js';

const config: Config = {
  apiToken: 'secret', apiBaseUrl: 'https://api.todoist.com/api/v1', mcpUrl: 'https://ai.todoist.net/mcp',
  timeoutMs: 1000, maxRetries: 1, requireWriteApproval: true, approvedActions: new Set()
};

describe('TodoistRestClient', () => {
  it('keeps credentials in the HTTP transport', async () => {
    const fake = vi.fn(async (_url: any, init: any) => new Response(JSON.stringify({ id: '1' }), { status: 200 }));
    const client = new TodoistRestClient(config, fake as any);
    await client.request('GET', '/tasks/1');
    expect(fake.mock.calls[0][1].headers.Authorization).toBe('Bearer secret');
  });

  it('retries a throttled read but stays bounded', async () => {
    const fake = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'slow' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 }));
    const client = new TodoistRestClient(config, fake as any);
    expect(await client.request('GET', '/tasks')).toEqual({ results: [] });
    expect(fake).toHaveBeenCalledTimes(2);
  });

  it('does not retry mutations by default', async () => {
    const fake = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'server' }), { status: 500 }));
    const client = new TodoistRestClient(config, fake as any);
    await expect(client.request('POST', '/tasks', { body: { content: 'x' } })).rejects.toMatchObject({ status: 500 });
    expect(fake).toHaveBeenCalledTimes(1);
  });

  it('follows cursor pagination with a page cap', async () => {
    const fake = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [{ id: '1' }], next_cursor: 'abc' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [{ id: '2' }], next_cursor: null }), { status: 200 }));
    const client = new TodoistRestClient(config, fake as any);
    const result = await client.paginate<any>('/tasks', { limit: 50 }, 3);
    expect(result.results.map(x => x.id)).toEqual(['1', '2']);
    expect(fake).toHaveBeenCalledTimes(2);
  });
});
