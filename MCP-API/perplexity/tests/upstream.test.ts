import assert from 'node:assert/strict';
import test from 'node:test';
import { loadConfig } from '../src/config.js';
import { PerplexityUpstream } from '../src/upstream.js';

test('REST transport sends bearer auth and returns JSON', async () => {
  const originalFetch = globalThis.fetch;
  let capturedAuth = '';
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    capturedAuth = String(new Headers(init?.headers).get('authorization'));
    return new Response(JSON.stringify({ id: 'search-1', results: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }) as typeof fetch;
  try {
    const upstream = new PerplexityUpstream(loadConfig({ PERPLEXITY_API_KEY: 'secret-test-key' }));
    const result = await upstream.post('/search', { query: 'test', max_results: 1 }) as { id: string };
    assert.equal(result.id, 'search-1');
    assert.equal(capturedAuth, 'Bearer secret-test-key');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('rate limit preserves Retry-After without retrying', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    return new Response('{}', { status: 429, headers: { 'retry-after': '7' } });
  }) as typeof fetch;
  try {
    const upstream = new PerplexityUpstream(loadConfig({ PERPLEXITY_API_KEY: 'x' }));
    await assert.rejects(() => upstream.post('/search', { query: 'test' }), /retry-after=7/);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('auth failures are not retried', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    return new Response('{}', { status: 401 });
  }) as typeof fetch;
  try {
    const upstream = new PerplexityUpstream(loadConfig({ PERPLEXITY_API_KEY: 'bad' }));
    await assert.rejects(() => upstream.post('/v1/agent', { preset: 'fast', input: 'x' }), /check API key/);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
