import { describe, expect, it, vi } from 'vitest';
import { AnthropicApiError, AnthropicClient } from '../src/client.js';
import { loadConfig } from '../src/config.js';

const config = loadConfig({ ANTHROPIC_API_KEY: 'secret', ANTHROPIC_MAX_RETRIES: '1', ANTHROPIC_TIMEOUT_MS: '1000' });

describe('AnthropicClient', () => {
  it('sends isolated authentication headers', async () => {
    const fakeFetch = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>)['x-api-key']).toBe('secret');
      expect((init?.headers as Record<string, string>)['anthropic-version']).toBe('2023-06-01');
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new AnthropicClient(config, fakeFetch);
    await client.get('/v1/models');
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded GET throttling and honors eventual success', async () => {
    let calls = 0;
    const fakeFetch = vi.fn(async () => {
      calls++;
      if (calls === 1) return new Response('{"error":"rate_limited"}', { status: 429, headers: { 'retry-after': '0' } });
      return new Response(JSON.stringify({ id: 'model-a' }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new AnthropicClient(config, fakeFetch);
    expect(await client.get('/v1/models/model-a')).toEqual({ id: 'model-a' });
    expect(fakeFetch).toHaveBeenCalledTimes(2);
  });

  it('does not automatically retry POST requests', async () => {
    const fakeFetch = vi.fn(async () => new Response('{"error":"temporary"}', { status: 500 })) as unknown as typeof fetch;
    const client = new AnthropicClient(config, fakeFetch);
    await expect(client.post('/v1/messages', { model: 'model-a' })).rejects.toBeInstanceOf(AnthropicApiError);
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it('returns batch results as JSONL text', async () => {
    const fakeFetch = vi.fn(async () => new Response('{"custom_id":"a"}\n', { status: 200, headers: { 'content-type': 'application/jsonl' } })) as unknown as typeof fetch;
    const client = new AnthropicClient(config, fakeFetch);
    expect(await client.get<string>('/v1/messages/batches/batch_1/results')).toContain('custom_id');
  });
});
