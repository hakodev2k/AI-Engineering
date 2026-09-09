import test from 'node:test';
import assert from 'node:assert/strict';
import { authorize, loadConfig, PolarApiError, PolarClient } from '../src/core.js';

test('configuration requires access token', () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /POLAR_ACCESS_TOKEN/);
});

test('sandbox is the safe default', () => {
  const cfg = loadConfig({ POLAR_ACCESS_TOKEN: 'polar_oat_test' } as NodeJS.ProcessEnv);
  assert.equal(cfg.baseUrl, 'https://sandbox-api.polar.sh/v1');
});

test('write and high-risk calls require approval by default', () => {
  const cfg = loadConfig({ POLAR_ACCESS_TOKEN: 'x' } as NodeJS.ProcessEnv);
  assert.throws(() => authorize('WRITE', false, cfg), /APPROVAL_REQUIRED/);
  assert.throws(() => authorize('HIGH_RISK', undefined, cfg), /APPROVAL_REQUIRED/);
  assert.doesNotThrow(() => authorize('READ', undefined, cfg));
});

test('successful GET returns parsed provider response', async () => {
  const fakeFetch = async () => new Response(JSON.stringify({ items: [] }), { status: 200 });
  const client = new PolarClient(loadConfig({ POLAR_ACCESS_TOKEN: 'x' } as NodeJS.ProcessEnv), fakeFetch as typeof fetch);
  assert.deepEqual(await client.request('GET', '/products', undefined, { page: 1, limit: 10 }), { items: [] });
});

test('authentication errors are not retried and are mapped', async () => {
  let calls = 0;
  const fakeFetch = async () => { calls++; return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 }); };
  const client = new PolarClient(loadConfig({ POLAR_ACCESS_TOKEN: 'x' } as NodeJS.ProcessEnv), fakeFetch as typeof fetch);
  await assert.rejects(() => client.request('GET', '/products'), (e: unknown) => e instanceof PolarApiError && e.status === 401);
  assert.equal(calls, 1);
});

test('write requests are never automatically retried', async () => {
  let calls = 0;
  const fakeFetch = async () => { calls++; return new Response(JSON.stringify({ error: 'busy' }), { status: 503 }); };
  const client = new PolarClient(loadConfig({ POLAR_ACCESS_TOKEN: 'x' } as NodeJS.ProcessEnv), fakeFetch as typeof fetch);
  await assert.rejects(() => client.request('POST', '/refunds', { order_id: 'x', amount: 1 }));
  assert.equal(calls, 1);
});

test('rate limit Retry-After is preserved in final error', async () => {
  let calls = 0;
  const fakeFetch = async () => { calls++; return new Response(JSON.stringify({ error: 'limited' }), { status: 429, headers: { 'retry-after': '1' } }); };
  const client = new PolarClient(loadConfig({ POLAR_ACCESS_TOKEN: 'x' } as NodeJS.ProcessEnv), fakeFetch as typeof fetch);
  await assert.rejects(() => client.request('GET', '/products'), (e: unknown) => e instanceof PolarApiError && e.retryAfter === 1);
  assert.equal(calls, 3);
});
