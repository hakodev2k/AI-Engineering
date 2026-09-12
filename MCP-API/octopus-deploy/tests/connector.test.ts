import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { ApprovalError, requireApproval } from '../src/policy.js';
import { OctopusRestClient, OctopusApiError } from '../src/rest.js';

test('loadConfig requires URL and API key and keeps writes disabled by default', () => {
  const config = loadConfig({ OCTOPUS_URL: 'https://octopus.example', OCTOPUS_API_KEY: 'API-test' });
  assert.equal(config.baseUrl, 'https://octopus.example');
  assert.equal(config.writeApproved, false);
  assert.equal(config.highRiskApproved, false);
});

test('WRITE and HIGH_RISK require separate human-controlled gates', () => {
  const base = loadConfig({ OCTOPUS_URL: 'https://octopus.example', OCTOPUS_API_KEY: 'API-test' });
  assert.throws(() => requireApproval(base, 'WRITE'), ApprovalError);
  assert.throws(() => requireApproval(base, 'HIGH_RISK'), ApprovalError);
  const write = { ...base, writeApproved: true };
  assert.doesNotThrow(() => requireApproval(write, 'WRITE'));
  assert.throws(() => requireApproval(write, 'HIGH_RISK'), ApprovalError);
  const high = { ...write, highRiskApproved: true };
  assert.doesNotThrow(() => requireApproval(high, 'HIGH_RISK'));
});

test('REST client sends credentials only in X-Octopus-ApiKey and maps JSON', async () => {
  let seenHeaders: Headers | undefined;
  const fakeFetch: typeof fetch = async (_input, init) => {
    seenHeaders = new Headers(init?.headers);
    return new Response(JSON.stringify({ Items: [{ Id: 'Projects-1' }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const config = loadConfig({ OCTOPUS_URL: 'https://octopus.example', OCTOPUS_API_KEY: 'API-secret' });
  const client = new OctopusRestClient(config, fakeFetch);
  const result = await client.get<{ Items: Array<{ Id: string }> }>('/Spaces-1/projects');
  assert.equal(result.Items[0]?.Id, 'Projects-1');
  assert.equal(seenHeaders?.get('X-Octopus-ApiKey'), 'API-secret');
  assert.equal(seenHeaders?.get('Authorization'), null);
});

test('REST client does not retry permission errors', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify({ ErrorMessage: 'Forbidden' }), { status: 403 });
  };
  const config = loadConfig({ OCTOPUS_URL: 'https://octopus.example', OCTOPUS_API_KEY: 'API-secret', OCTOPUS_MAX_RETRIES: '5' });
  const client = new OctopusRestClient(config, fakeFetch);
  await assert.rejects(() => client.get('/Spaces-1/projects'), (error: unknown) => error instanceof OctopusApiError && error.status === 403);
  assert.equal(calls, 1);
});

test('REST client retries a throttled GET and preserves bounded behavior', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    if (calls === 1) return new Response('{}', { status: 429, headers: { 'retry-after': '0' } });
    return new Response(JSON.stringify({ Items: [] }), { status: 200 });
  };
  const config = loadConfig({ OCTOPUS_URL: 'https://octopus.example', OCTOPUS_API_KEY: 'API-secret', OCTOPUS_MAX_RETRIES: '1' });
  const client = new OctopusRestClient(config, fakeFetch);
  const result = await client.get<{ Items: unknown[] }>('/Spaces-1/releases');
  assert.deepEqual(result.Items, []);
  assert.equal(calls, 2);
});

test('POST network failures are not blindly retried', async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    throw new Error('network down');
  };
  const config = loadConfig({ OCTOPUS_URL: 'https://octopus.example', OCTOPUS_API_KEY: 'API-secret', OCTOPUS_MAX_RETRIES: '3' });
  const client = new OctopusRestClient(config, fakeFetch);
  await assert.rejects(() => client.post('/Spaces-1/deployments/v1', { ReleaseId: 'Releases-1' }));
  assert.equal(calls, 1);
});
