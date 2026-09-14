import assert from 'node:assert/strict';
import test from 'node:test';
import { BrowserbaseClient, BrowserbaseApiError } from '../src/client.js';
import type { Config } from '../src/config.js';

const config: Config = { apiKey: 'test-key', projectId: 'p1', apiBaseUrl: 'https://api.browserbase.com', mcpUrl: new URL('https://mcp.browserbase.com/mcp?browserbaseApiKey=test-key'), timeoutMs: 1000, allowedHosts: new Set() };

test('sends API key header and parses JSON', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(new Headers(init?.headers).get('X-BB-API-Key'), 'test-key');
    return new Response(JSON.stringify({ id: 's1' }), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  try { assert.deepEqual(await new BrowserbaseClient(config).request('/v1/sessions/s1'), { id: 's1' }); }
  finally { globalThis.fetch = original; }
});

test('does not retry a non-idempotent POST', async () => {
  const original = globalThis.fetch; let calls = 0;
  globalThis.fetch = (async () => { calls++; return new Response(JSON.stringify({ message: 'busy' }), { status: 503 }); }) as typeof fetch;
  try {
    await assert.rejects(() => new BrowserbaseClient(config).request('/v1/sessions', { method: 'POST', body: {}, retryable: false }), BrowserbaseApiError);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = original; }
});

test('preserves retry-after on rate limit', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify({ message: 'limited' }), { status: 429, headers: { 'retry-after': '7' } })) as typeof fetch;
  try {
    await assert.rejects(() => new BrowserbaseClient(config).request('/v1/search', { method: 'POST', body: {}, retryable: false }), (e: unknown) => e instanceof BrowserbaseApiError && e.retryAfter === 7);
  } finally { globalThis.fetch = original; }
});
