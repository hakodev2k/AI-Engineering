import test from 'node:test';
import assert from 'node:assert/strict';
import { HoneybadgerApi } from '../src/api.js';

const cfg = {
  token: 'secret-test-token', region: 'us' as const, apiUrl: 'https://app.honeybadger.io', upstreamCommand: 'docker', upstreamImage: 'image', requireWriteApproval: true, destructiveEnabled: false, timeoutMs: 1000
};

test('API client isolates credentials in Basic auth and parses JSON', async () => {
  const old = globalThis.fetch;
  globalThis.fetch = (async (input: any, init: any) => {
    assert.equal(String(input), 'https://app.honeybadger.io/v2/projects/1/sites');
    assert.equal(init.headers.Authorization, `Basic ${Buffer.from('secret-test-token:').toString('base64')}`);
    return new Response(JSON.stringify({ results: [{ id: 'x' }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  try {
    const api = new HoneybadgerApi(cfg);
    const out = await api.request<any>('GET','/v2/projects/1/sites');
    assert.equal(out.results[0].id, 'x');
  } finally { globalThis.fetch = old; }
});

test('API client does not retry authorization failures', async () => {
  const old = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => { calls++; return new Response('{"error":"forbidden"}', { status: 403, headers: { 'x-ratelimit-remaining': '12' } }); }) as typeof fetch;
  try {
    await assert.rejects(() => new HoneybadgerApi(cfg).request('GET','/v2/projects/1/sites'), /403/);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = old; }
});

test('API client retries transient GET failures with a bound', async () => {
  const old = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    return calls < 3 ? new Response('temporary', { status: 503 }) : new Response('{"ok":true}', { status: 200 });
  }) as typeof fetch;
  try {
    const out = await new HoneybadgerApi(cfg).request<any>('GET','/v2/projects/1/sites');
    assert.equal(out.ok, true);
    assert.equal(calls, 3);
  } finally { globalThis.fetch = old; }
});
