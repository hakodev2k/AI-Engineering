import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, approvalDigest } from '../src/config.js';
import { authorize } from '../src/policy.js';
import { BrevoClient, BrevoError } from '../src/client.js';

test('configuration requires https base URL', () => {
  assert.throws(() => loadConfig({ BREVO_API_BASE_URL: 'http://api.brevo.com/v3' }), /https/);
});

test('read operations do not require approval', () => {
  authorize(loadConfig({ BREVO_API_KEY: 'x' }), 'brevo.contact.list', {});
});

test('writes are disabled by default', () => {
  assert.throws(() => authorize(loadConfig({ BREVO_API_KEY: 'x' }), 'brevo.contact.create', { email: 'a@example.com' }), /disabled/);
});

test('approval is bound to exact arguments', () => {
  const config = loadConfig({ BREVO_API_KEY: 'x', BREVO_ALLOW_WRITE: 'true', BREVO_APPROVAL_SECRET: 'secret' });
  const args = { email: 'a@example.com' };
  const approvalToken = approvalDigest('secret', 'brevo.contact.create', args);
  authorize(config, 'brevo.contact.create', { ...args, approvalToken });
  assert.throws(() => authorize(config, 'brevo.contact.create', { email: 'b@example.com', approvalToken }), /does not match/);
});

test('client sends api-key header and parses JSON', async () => {
  let seen;
  const fetchImpl = async (url, init) => {
    seen = { url: String(url), init };
    return new Response(JSON.stringify({ count: 1 }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const client = new BrevoClient(loadConfig({ BREVO_API_KEY: 'secret-key' }), fetchImpl);
  const result = await client.request('GET', '/contacts', { query: { limit: 10 } });
  assert.equal(result.data.count, 1);
  assert.equal(seen.init.headers['api-key'], 'secret-key');
  assert.match(seen.url, /limit=10/);
});

test('client maps provider errors and does not retry unsafe writes', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    return new Response(JSON.stringify({ code: 'invalid_parameter', message: 'bad input' }), { status: 400 });
  };
  const client = new BrevoClient(loadConfig({ BREVO_API_KEY: 'x', BREVO_MAX_RETRIES: '3' }), fetchImpl);
  await assert.rejects(() => client.request('POST', '/contacts', { body: {}, retrySafe: false }), BrevoError);
  assert.equal(calls, 1);
});

test('client preserves Retry-After metadata on 429 when retries disabled', async () => {
  const fetchImpl = async () => new Response(JSON.stringify({ message: 'rate limited' }), { status: 429, headers: { 'retry-after': '2' } });
  const client = new BrevoClient(loadConfig({ BREVO_API_KEY: 'x', BREVO_MAX_RETRIES: '0' }), fetchImpl);
  await assert.rejects(async () => {
    try { await client.request('GET', '/contacts'); }
    catch (e) { assert.equal(e.retryAfter, 2000); throw e; }
  }, BrevoError);
});

test('destructive actions require dedicated enable flag', () => {
  const args = { identifier: 'a@example.com' };
  const config = loadConfig({ BREVO_API_KEY: 'x', BREVO_ALLOW_WRITE: 'true', BREVO_APPROVAL_SECRET: 'secret' });
  const approvalToken = approvalDigest('secret', 'brevo.contact.delete', args);
  assert.throws(() => authorize(config, 'brevo.contact.delete', { ...args, approvalToken }), /BREVO_ALLOW_DESTRUCTIVE/);
});
