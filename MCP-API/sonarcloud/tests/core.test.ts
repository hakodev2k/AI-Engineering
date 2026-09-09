import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, normalizeCloudUrl, type Config } from '../src/config.js';
import { authorize, assertHttpsWebhook } from '../src/policy.js';
import { SonarRestClient, SonarError } from '../src/upstream.js';

const cfg: Config = {
  token: 'test-token',
  organization: 'test-org',
  baseUrl: 'https://sonarcloud.io',
  mcpImage: 'mcp/sonarqube',
  timeoutMs: 2000,
  requireWriteApproval: true,
  allowWebhookWrites: false,
  mcpEnabled: false
};

test('configuration requires isolated credentials', () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /SONARQUBE_TOKEN/);
  assert.throws(() => loadConfig({ SONARQUBE_TOKEN: 'x' } as NodeJS.ProcessEnv), /SONARQUBE_ORG/);
});

test('cloud URL is restricted to official SonarQube Cloud hosts', () => {
  assert.equal(normalizeCloudUrl(undefined), 'https://sonarcloud.io');
  assert.equal(normalizeCloudUrl('https://sonarqube.us/'), 'https://sonarqube.us');
  assert.throws(() => normalizeCloudUrl('http://sonarcloud.io'), /HTTPS/);
  assert.throws(() => normalizeCloudUrl('https://example.com'), /must be/);
});

test('write operations require approval and high-risk writes are disabled by default', () => {
  assert.doesNotThrow(() => authorize('READ', undefined, cfg));
  assert.throws(() => authorize('WRITE', false, cfg), /approval/);
  assert.doesNotThrow(() => authorize('WRITE', true, cfg));
  assert.throws(() => authorize('HIGH_RISK', true, cfg), /disabled/);
});

test('webhook validation rejects non-HTTPS and private IPv4 targets', () => {
  assert.throws(() => assertHttpsWebhook('http://hooks.example.com/x'), /HTTPS/);
  assert.throws(() => assertHttpsWebhook('https://127.0.0.1/x'), /loopback/);
  assert.throws(() => assertHttpsWebhook('https://10.0.0.8/x'), /private/);
  assert.doesNotThrow(() => assertHttpsWebhook('https://hooks.example.com/sonar'));
});

test('REST client sends bearer auth and organization query without leaking token into URL', async () => {
  let seenUrl = '';
  let seenAuth = '';
  const fakeFetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    seenUrl = String(input);
    seenAuth = String((init?.headers as Record<string, string>)?.Authorization);
    return new Response(JSON.stringify({ issues: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  const client = new SonarRestClient(cfg, fakeFetch);
  const data = await client.request('GET', 'issues/search', { organization: cfg.organization }, true);
  assert.deepEqual(data, { issues: [] });
  assert.match(seenUrl, /organization=test-org/);
  assert.doesNotMatch(seenUrl, /test-token/);
  assert.equal(seenAuth, 'Bearer test-token');
});

test('REST client maps provider errors and does not retry non-idempotent writes', async () => {
  let calls = 0;
  const fakeFetch = (async () => {
    calls++;
    return new Response('forbidden', { status: 403 });
  }) as typeof fetch;
  const client = new SonarRestClient(cfg, fakeFetch);
  await assert.rejects(() => client.request('POST', 'issues/do_transition', { issue: 'x', transition: 'accept' }), (error: unknown) => {
    assert.ok(error instanceof SonarError);
    assert.equal(error.status, 403);
    return true;
  });
  assert.equal(calls, 1);
});
