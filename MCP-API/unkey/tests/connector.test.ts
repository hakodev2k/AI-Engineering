import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';
import { UnkeyClient, UnkeyError } from '../src/client.js';
import { buildTools } from '../src/tools.js';

const env = {
  UNKEY_ROOT_KEY: 'unkey_test',
  UNKEY_API_BASE: 'https://api.unkey.com',
  UNKEY_ALLOWED_API_HOSTS: 'api.unkey.com',
  UNKEY_REQUEST_TIMEOUT_MS: '1000',
};

test('config rejects non-HTTPS/SSRF destinations', () => {
  assert.throws(() => loadConfig({ ...env, UNKEY_API_BASE: 'http://localhost:3000' }), /HTTPS/);
  assert.throws(() => loadConfig({ ...env, UNKEY_API_BASE: 'https://evil.example' }), /not allowed/);
});

test('policy enforces approvals and destructive default', () => {
  const cfg = { requireWriteApproval: true, destructiveEnabled: false };
  assert.doesNotThrow(() => authorize('READ', undefined, cfg));
  assert.throws(() => authorize('WRITE', false, cfg), /approval/);
  assert.throws(() => authorize('HIGH_RISK', false, cfg), /approval/);
  assert.throws(() => authorize('DESTRUCTIVE', true, cfg), /disabled/);
});

test('tool registry exposes expected stable tool names and no generic request tool', () => {
  const fake = { call: async () => ({}) } as unknown as UnkeyClient;
  const names = buildTools(fake).map(t => t.name);
  assert.equal(names.length, 11);
  assert.ok(names.includes('unkey.key.create'));
  assert.ok(names.includes('unkey.ratelimit.override.set'));
  assert.equal(names.some(n => /request|raw|execute_any/.test(n)), false);
});

test('client maps 403 without retry', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response(JSON.stringify({ meta: { requestId: 'req_1' }, error: { detail: 'missing permission' } }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  };
  const client = new UnkeyClient(loadConfig(env), fakeFetch);
  await assert.rejects(() => client.call('keys.getKey', { keyId: 'key_123' }), (e: any) => e instanceof UnkeyError && e.status === 403 && e.requestId === 'req_1');
  assert.equal(calls, 1);
});

test('client retries 429 and preserves retry semantics', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls < 3) return new Response(JSON.stringify({ error: { detail: 'throttled' } }), { status: 429, headers: { 'retry-after': '0' } });
    return new Response(JSON.stringify({ meta: { requestId: 'req_ok' }, data: { keys: [] } }), { status: 200 });
  };
  const client = new UnkeyClient(loadConfig(env), fakeFetch);
  const result: any = await client.call('keys.listKeys', { apiId: 'api_123' });
  assert.equal(calls, 3);
  assert.deepEqual(result.data.keys, []);
});

test('non-retryable write executes once on server failure', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => { calls++; return new Response('{}', { status: 503 }); };
  const client = new UnkeyClient(loadConfig(env), fakeFetch);
  await assert.rejects(() => client.call('keys.createKey', { apiId: 'api_123' }, false));
  assert.equal(calls, 1);
});
