import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { requireApproval, ApprovalError } from '../src/policy.js';
import { SauceRestClient, SauceApiError } from '../src/rest.js';
import { TOOL_NAMES } from '../src/tools.js';

const baseConfig = {
  username: 'ci-user',
  accessKey: 'not-a-real-secret',
  region: 'us-west-1' as const,
  apiBaseUrl: 'https://api.us-west-1.saucelabs.com',
  mcpUrl: 'https://mcp.saucelabs.com',
  timeoutMs: 1000,
  maxRetries: 2,
  enableWrites: false
};

test('tool registry exposes bounded provider-scoped capabilities', () => {
  assert.equal(TOOL_NAMES.length, 12);
  assert.ok(TOOL_NAMES.every(name => name.startsWith('saucelabs.')));
  assert.ok(!TOOL_NAMES.some(name => name.includes('delete') || name.includes('raw')));
});

test('loadConfig requires credentials and validates region', () => {
  const snapshot = { ...process.env };
  try {
    delete process.env.SAUCE_USERNAME;
    delete process.env.SAUCE_ACCESS_KEY;
    assert.throws(() => loadConfig(), /required/);
    process.env.SAUCE_USERNAME = 'u';
    process.env.SAUCE_ACCESS_KEY = 'k';
    process.env.SAUCE_REGION = 'invalid';
    assert.throws(() => loadConfig(), /SAUCE_REGION/);
  } finally {
    process.env = snapshot;
  }
});

test('writes require both deployment gate and explicit approval', () => {
  assert.throws(() => requireApproval(baseConfig, 'WRITE', true), ApprovalError);
  const enabled = { ...baseConfig, enableWrites: true };
  assert.throws(() => requireApproval(enabled, 'WRITE', false), ApprovalError);
  assert.doesNotThrow(() => requireApproval(enabled, 'WRITE', true));
  assert.throws(() => requireApproval(enabled, 'DESTRUCTIVE', true), /disabled/);
});

test('GET retries boundedly on throttling and respects success', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    if (calls < 3) return new Response(JSON.stringify({ error: 'throttled' }), { status: 429, headers: { 'retry-after': '0' } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }) as typeof fetch;
  try {
    const client = new SauceRestClient(baseConfig);
    const result = await client.request<{ ok: boolean }>('GET', '/rest/v1/ci-user/jobs');
    assert.deepEqual(result, { ok: true });
    assert.equal(calls, 3);
  } finally {
    globalThis.fetch = original;
  }
});

test('write calls are never blindly retried', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    return new Response(JSON.stringify({ error: 'server' }), { status: 503 });
  }) as typeof fetch;
  try {
    const client = new SauceRestClient({ ...baseConfig, enableWrites: true });
    await assert.rejects(() => client.stopVirtualJob('abcdef123456'), (error: unknown) => error instanceof SauceApiError && error.status === 503);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = original;
  }
});
