import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, approvalDigest } from '../src/config.js';
import { authorize, TOOL_POLICY } from '../src/policy.js';
import { BrowserStackClient, BrowserStackError } from '../src/client.js';
import { TOOLS } from '../src/server.js';

function withEnv(values, fn) {
  const old = {};
  for (const [k, v] of Object.entries(values)) {
    old[k] = process.env[k];
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
  try { return fn(); } finally {
    for (const [k, v] of Object.entries(old)) {
      if (v === undefined) delete process.env[k]; else process.env[k] = v;
    }
  }
}

test('tool registry matches policy', () => {
  const names = TOOLS.map(t => t.name).sort();
  assert.deepEqual(names, Object.keys(TOOL_POLICY).sort());
  assert.equal(names.length, 14);
});

test('configuration requires credentials', () => {
  withEnv({ BROWSERSTACK_USERNAME: undefined, BROWSERSTACK_ACCESS_KEY: undefined }, () => {
    assert.throws(loadConfig, /BROWSERSTACK_USERNAME/);
  });
});

test('configuration rejects non-HTTPS API origins', () => {
  withEnv({ BROWSERSTACK_USERNAME: 'u', BROWSERSTACK_ACCESS_KEY: 'k', BROWSERSTACK_API_BASE_URL: 'http://api.browserstack.com' }, () => {
    assert.throws(loadConfig, /HTTPS/);
  });
});

test('read tool requires no approval', () => {
  assert.doesNotThrow(() => authorize({ approvalSecret: '', destructiveEnabled: false }, 'browserstack.session.get', { sessionId: 'abc' }));
});

test('write approval is bound to exact payload', () => {
  const config = { approvalSecret: 'secret', destructiveEnabled: false };
  const tool = 'browserstack.session.update_status';
  const payload = { sessionId: 'abc', status: 'failed', reason: 'assertion failed' };
  const token = approvalDigest(config.approvalSecret, tool, payload);
  assert.doesNotThrow(() => authorize(config, tool, payload, token));
  assert.throws(() => authorize(config, tool, { ...payload, status: 'passed' }, token), /Invalid approval/);
});

test('destructive operation disabled by default', () => {
  assert.throws(() => authorize({ approvalSecret: 'secret', destructiveEnabled: false }, 'browserstack.build.delete', { buildId: 'b' }, '0'.repeat(64)), /disabled/);
});

test('client sends Basic auth and parses successful response', async () => {
  let observed;
  const fakeFetch = async (url, init) => {
    observed = { url: String(url), init };
    return new Response(JSON.stringify({ parallel_sessions_running: 1 }), { status: 200 });
  };
  const client = new BrowserStackClient({ username: 'user', accessKey: 'key', baseUrl: 'https://api.browserstack.com', timeoutMs: 1000, maxRetries: 0 }, fakeFetch);
  const result = await client.getPlan();
  assert.equal(result.parallel_sessions_running, 1);
  assert.match(observed.init.headers.Authorization, /^Basic /);
});

test('authentication failures are not retried', async () => {
  let calls = 0;
  const fakeFetch = async () => { calls++; return new Response('Unauthorized', { status: 401 }); };
  const client = new BrowserStackClient({ username: 'u', accessKey: 'bad', baseUrl: 'https://api.browserstack.com', timeoutMs: 1000, maxRetries: 3 }, fakeFetch);
  await assert.rejects(client.getPlan(), e => e instanceof BrowserStackError && e.status === 401);
  assert.equal(calls, 1);
});

test('safe reads retry throttling but writes do not', async () => {
  let readCalls = 0;
  const readFetch = async () => {
    readCalls++;
    if (readCalls === 1) return new Response(JSON.stringify({ message: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } });
    return new Response(JSON.stringify([]), { status: 200 });
  };
  const cfg = { username: 'u', accessKey: 'k', baseUrl: 'https://api.browserstack.com', timeoutMs: 1000, maxRetries: 1 };
  const readClient = new BrowserStackClient(cfg, readFetch);
  await readClient.listProjects();
  assert.equal(readCalls, 2);

  let writeCalls = 0;
  const writeClient = new BrowserStackClient(cfg, async () => { writeCalls++; return new Response('temporary', { status: 503 }); });
  await assert.rejects(writeClient.updateSessionName({ sessionId: 's', name: 'new' }));
  assert.equal(writeCalls, 1);
});
