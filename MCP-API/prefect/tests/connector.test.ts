import test from 'node:test';
import assert from 'node:assert/strict';
import { approvalDigest, loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';
import { PrefectClient, PrefectError, cleanProviderData } from '../src/client.js';

const baseEnv = {
  PREFECT_API_URL: 'https://api.prefect.cloud/api/accounts/a/workspaces/w',
  PREFECT_API_KEY: 'pnu_test',
  PREFECT_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef',
  PREFECT_ENABLE_HIGH_RISK: 'true'
};

test('config validates secure URL and defaults', () => {
  const cfg = loadConfig(baseEnv);
  assert.equal(cfg.apiUrl, baseEnv.PREFECT_API_URL);
  assert.equal(cfg.requireWriteApproval, true);
  assert.equal(cfg.maxRetries, 2);
  assert.throws(() => loadConfig({ PREFECT_API_URL: 'http://example.com' }), /HTTPS/);
});

test('high-risk approval binds exact payload', () => {
  const cfg = loadConfig(baseEnv);
  const payload = { deployment_id: '3c90c3cc-0d44-4b50-8888-8dd25736052a', parameters: { n: 1 } };
  const token = approvalDigest(cfg.approvalSecret!, 'prefect.deployment.run', payload);
  assert.doesNotThrow(() => authorize(cfg, 'prefect.deployment.run', 'HIGH_RISK', payload, token));
  assert.throws(() => authorize(cfg, 'prefect.deployment.run', 'HIGH_RISK', { ...payload, parameters: { n: 2 } }, token), /approval/);
});

test('high risk is disabled by default', () => {
  const cfg = loadConfig({ ...baseEnv, PREFECT_ENABLE_HIGH_RISK: 'false' });
  assert.throws(() => authorize(cfg, 'prefect.flow_run.cancel', 'HIGH_RISK', { flow_run_id: 'x' }, '0'.repeat(64)), /disabled/);
});

test('client injects bearer credential and API version', async () => {
  let headers: Headers | undefined;
  const fakeFetch: typeof fetch = async (_input, init) => {
    headers = new Headers(init?.headers);
    return new Response(JSON.stringify([{ id: 'x' }]), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const cfg = loadConfig(baseEnv);
  const client = new PrefectClient(cfg, fakeFetch);
  await client.request('POST', '/flow_runs/filter', { limit: 1 }, true);
  assert.equal(headers?.get('authorization'), `Bearer ${baseEnv.PREFECT_API_KEY}`);
  assert.equal(headers?.get('x-prefect-api-version'), '0.8.4');
});

test('mutation is never blindly retried', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => { calls++; return new Response('busy', { status: 503 }); };
  const client = new PrefectClient(loadConfig({ ...baseEnv, PREFECT_MAX_RETRIES: '5' }), fakeFetch);
  await assert.rejects(() => client.request('POST', '/deployments/x/create_flow_run', {}, false), PrefectError);
  assert.equal(calls, 1);
});

test('429 read retries are bounded', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls < 2) return new Response('rate limited', { status: 429, headers: { 'retry-after': '0' } });
    return new Response('[]', { status: 200 });
  };
  const client = new PrefectClient(loadConfig({ ...baseEnv, PREFECT_MAX_RETRIES: '2' }), fakeFetch);
  await client.request('POST', '/flow_runs/filter', {}, true);
  assert.equal(calls, 2);
});

test('provider credential-shaped fields are redacted', () => {
  assert.deepEqual(cleanProviderData({ name: 'ok', api_key: 'secret', nested: { password: 'x' } }), { name: 'ok', api_key: '[REDACTED]', nested: { password: '[REDACTED]' } });
});
