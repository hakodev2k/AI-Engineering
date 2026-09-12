import test from 'node:test';
import assert from 'node:assert/strict';
import { GongClient, GongApiError } from '../src/client.js';
import { loadConfig } from '../src/config.js';
import { requireApproval } from '../src/policy.js';

const base = {
  apiBaseUrl: 'https://api.gong.io',
  oauthAccessToken: 'test-token',
  timeoutMs: 2000,
  maxRetries: 0,
  highRiskApproved: false
};

test('configuration requires credentials and rejects non-Gong hosts', () => {
  assert.throws(() => loadConfig({}));
  assert.throws(() => loadConfig({ GONG_OAUTH_ACCESS_TOKEN: 'x', GONG_API_BASE_URL: 'https://example.com' }));
  assert.equal(loadConfig({ GONG_OAUTH_ACCESS_TOKEN: 'x' }).apiBaseUrl, 'https://api.gong.io');
});

test('OAuth token stays in connector Authorization header', async () => {
  let authorization = '';
  const fakeFetch: typeof fetch = async (_input, init) => {
    authorization = new Headers(init?.headers).get('Authorization') || '';
    return new Response(JSON.stringify({ users: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  const client = new GongClient(base, fakeFetch);
  await client.get('/v2/users');
  assert.equal(authorization, 'Bearer test-token');
});

test('Basic authentication is supported without returning credentials', async () => {
  let authorization = '';
  const fakeFetch: typeof fetch = async (_input, init) => {
    authorization = new Headers(init?.headers).get('Authorization') || '';
    return new Response('{}', { status: 200 });
  };
  const client = new GongClient({ ...base, oauthAccessToken: undefined, accessKey: 'key', accessKeySecret: 'secret' }, fakeFetch);
  assert.deepEqual(await client.get('/v2/users'), {});
  assert.match(authorization, /^Basic /);
});

test('permission-changing operation is denied without approval', () => {
  assert.throws(() => requireApproval(base, 'HIGH_RISK'), /Explicit human approval/);
  assert.doesNotThrow(() => requireApproval({ ...base, highRiskApproved: true }, 'HIGH_RISK'));
});

test('429 preserves Retry-After and does not leak auth', async () => {
  const fakeFetch: typeof fetch = async () => new Response(JSON.stringify({ errors: ['rate limited'] }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', 'Retry-After': '7' }
  });
  const client = new GongClient(base, fakeFetch);
  await assert.rejects(client.get('/v2/users'), (error: unknown) => {
    assert.ok(error instanceof GongApiError);
    assert.equal(error.status, 429);
    assert.equal(error.retryAfterSeconds, 7);
    assert.doesNotMatch(error.message, /test-token/);
    return true;
  });
});

test('PUT writes are not automatically retried', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response(JSON.stringify({ errors: ['temporary'] }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  };
  const client = new GongClient({ ...base, maxRetries: 3, highRiskApproved: true }, fakeFetch);
  await assert.rejects(client.put('/v2/calls/users-access', { callAccessList: [] }));
  assert.equal(calls, 1);
});
