import assert from 'node:assert/strict';
import test from 'node:test';
import { BaserowClient, BaserowError } from '../src/client.js';
import { loadConfig } from '../src/config.js';

const config = loadConfig({
  BASEROW_BASE_URL: 'https://api.baserow.io',
  BASEROW_DATABASE_TOKEN: 'unit-test-token',
  BASEROW_TIMEOUT_MS: '5000',
  BASEROW_MAX_RETRIES: '1'
});

test('client sends isolated token and parses JSON', async () => {
  let seenAuth = '';
  const fakeFetch: typeof fetch = async (_input, init) => {
    seenAuth = new Headers(init?.headers).get('authorization') ?? '';
    return new Response(JSON.stringify({ id: 7 }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const client = new BaserowClient(config, fakeFetch);
  const result = await client.request<{ id: number }>('GET', '/api/database/rows/table/1/7/');
  assert.equal(result.id, 7);
  assert.equal(seenAuth, 'Token unit-test-token');
});

test('client does not retry non-idempotent writes', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response('temporary', { status: 503 });
  };
  const client = new BaserowClient(config, fakeFetch);
  await assert.rejects(() => client.request('POST', '/api/database/rows/table/1/', { body: { Name: 'x' }, retryable: false }), BaserowError);
  assert.equal(calls, 1);
});

test('client retries bounded read throttling and preserves retry metadata', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls === 1) return new Response('slow down', { status: 429, headers: { 'retry-after': '0' } });
    return new Response(JSON.stringify({ results: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const client = new BaserowClient(config, fakeFetch);
  const result = await client.request<{ results: unknown[] }>('GET', '/api/database/rows/table/1/');
  assert.equal(calls, 2);
  assert.deepEqual(result.results, []);
});

test('client surfaces authentication failures without retrying', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response('invalid token', { status: 401 });
  };
  const client = new BaserowClient(config, fakeFetch);
  await assert.rejects(() => client.request('GET', '/api/database/rows/table/1/'), (error: unknown) => error instanceof BaserowError && error.status === 401);
  assert.equal(calls, 1);
});
