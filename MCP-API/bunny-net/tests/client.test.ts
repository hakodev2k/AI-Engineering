import test from 'node:test';
import assert from 'node:assert/strict';
import { BunnyApiError, BunnyClient } from '../src/client.js';
import type { BunnyConfig } from '../src/config.js';

const config: BunnyConfig = {
  apiKey: 'test-key',
  apiBaseUrl: 'https://api.bunny.net',
  timeoutMs: 2000,
  maxRetries: 1,
  approvalMode: 'required',
  allowDestructive: false,
};

test('sends AccessKey and parses successful JSON', async () => {
  const calls: Request[] = [];
  const fakeFetch: typeof fetch = async (input, init) => {
    const request = new Request(input, init);
    calls.push(request);
    return new Response(JSON.stringify([{ Id: 1 }]), { status: 200, headers: { 'content-type': 'application/json', 'x-ratelimit-limit': '100', 'x-ratelimit-remaining': '99' } });
  };
  const client = new BunnyClient(config, fakeFetch);
  const result = await client.request('/pullzone');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers.get('AccessKey'), 'test-key');
  assert.deepEqual(result.data, [{ Id: 1 }]);
  assert.equal(result.rateLimit?.remaining, 99);
});

test('rejects unrestricted/absolute provider paths to prevent SSRF', async () => {
  const client = new BunnyClient(config, fetch);
  await assert.rejects(() => client.request('https://evil.example/steal'), /relative bunny.net API path/);
});

test('maps provider errors and does not retry mutating requests', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response(JSON.stringify({ Message: 'Invalid request' }), { status: 400, statusText: 'Bad Request' });
  };
  const client = new BunnyClient(config, fakeFetch);
  await assert.rejects(() => client.request('/dnszone/1/records', { method: 'PUT', body: {} }), (err: unknown) => {
    assert.ok(err instanceof BunnyApiError);
    assert.equal(err.status, 400);
    return true;
  });
  assert.equal(calls, 1);
});

test('retries bounded GET requests on 429 then succeeds', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls === 1) return new Response('{}', { status: 429, headers: { 'retry-after': '0' } });
    return new Response(JSON.stringify({ Id: 1 }), { status: 200 });
  };
  const client = new BunnyClient(config, fakeFetch);
  const result = await client.request('/pullzone/1');
  assert.deepEqual(result.data, { Id: 1 });
  assert.equal(calls, 2);
});
