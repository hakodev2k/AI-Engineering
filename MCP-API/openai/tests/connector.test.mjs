import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, assertModelAllowed, OFFICIAL_API_BASE } from '../src/config.mjs';
import {
  TOOL_RISK,
  operationTarget,
  createApprovalToken,
  assertApproved,
  resetApprovalReplayCacheForTests
} from '../src/policy.mjs';
import { OpenAIClient, OpenAIHttpError } from '../src/client.mjs';
import { TOOL_NAMES } from '../src/server.mjs';

const env = {
  OPENAI_API_KEY: 'sk-test-abcdefghijklmnopqrstuvwxyz012345',
  OPENAI_APPROVAL_SECRET: '01234567890123456789012345678901',
  OPENAI_REQUIRE_WRITE_APPROVAL: 'true',
  OPENAI_TIMEOUT_MS: '5000',
  OPENAI_MAX_READ_RETRIES: '2',
  OPENAI_MAX_RETRY_DELAY_MS: '30000'
};

function config(overrides = {}) {
  return loadConfig({ ...env, ...overrides });
}

test('configuration uses only the official API base and requires credentials', () => {
  assert.equal(config().apiBase, OFFICIAL_API_BASE);
  assert.throws(() => loadConfig({}), /OPENAI_API_KEY is required/);
  assert.throws(() => config({ OPENAI_MAX_READ_RETRIES: '99' }), /between 0 and 3/);
});

test('optional model allowlist prevents unexpected model spend', () => {
  const cfg = config({ OPENAI_ALLOWED_MODELS: 'gpt-5.6,gpt-5.4' });
  assert.doesNotThrow(() => assertModelAllowed(cfg, 'gpt-5.6'));
  assert.throws(() => assertModelAllowed(cfg, 'chat-latest'), /not in OPENAI_ALLOWED_MODELS/);
});

test('operation target is canonical across object key ordering', () => {
  assert.equal(operationTarget({ b: 2, a: 1 }), operationTarget({ a: 1, b: 2 }));
});

test('READ operations do not require approval', () => {
  assert.doesNotThrow(() => assertApproved(config(), 'openai.model.list', operationTarget({})));
});

test('WRITE operations require a resource-bound approval by default', () => {
  resetApprovalReplayCacheForTests();
  const cfg = config();
  const payload = { model: 'gpt-5.6', input: 'hello', store: false };
  const target = operationTarget(payload);
  assert.throws(() => assertApproved(cfg, 'openai.response.create', target), /Approval required/);

  const expiresAt = Date.now() + 60_000;
  const nonce = 'abcdefghijklmnop123456';
  const token = createApprovalToken(cfg.approvalSecret, 'openai.response.create', target, expiresAt, nonce);
  assert.doesNotThrow(() => assertApproved(cfg, 'openai.response.create', target, token, expiresAt, nonce));
  assert.throws(() => assertApproved(cfg, 'openai.response.create', target, token, expiresAt, nonce), /already been used/);
});

test('approval cannot be reused for a different target', () => {
  resetApprovalReplayCacheForTests();
  const cfg = config();
  const expiresAt = Date.now() + 60_000;
  const nonce = 'abcdefghijklmnop654321';
  const token = createApprovalToken(cfg.approvalSecret, 'openai.response.cancel', operationTarget({ response_id: 'resp_A' }), expiresAt, nonce);
  assert.throws(
    () => assertApproved(cfg, 'openai.response.cancel', operationTarget({ response_id: 'resp_B' }), token, expiresAt, nonce),
    /Invalid approval token/
  );
});

test('read-safe calls retry temporary 429 and preserve rate-limit metadata', async () => {
  let calls = 0;
  const sleeps = [];
  const fetchImpl = async () => {
    calls++;
    if (calls === 1) {
      return new Response(JSON.stringify({ error: { message: 'rate limited', type: 'rate_limit_error' } }), {
        status: 429,
        headers: { 'content-type': 'application/json', 'retry-after': '0' }
      });
    }
    return new Response(JSON.stringify({ object: 'list', data: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'x-request-id': 'req_123', 'x-ratelimit-remaining-requests': '9' }
    });
  };
  const client = new OpenAIClient(config(), { fetchImpl, sleep: async ms => sleeps.push(ms), random: () => 0 });
  const result = await client.listModels();
  assert.equal(calls, 2);
  assert.deepEqual(sleeps, [0]);
  assert.equal(result.meta.requestId, 'req_123');
  assert.equal(result.meta.rateLimit['x-ratelimit-remaining-requests'], '9');
});

test('quota 429 is not retried', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    return new Response(JSON.stringify({ error: { message: 'quota exhausted', code: 'insufficient_quota' } }), {
      status: 429,
      headers: { 'content-type': 'application/json' }
    });
  };
  const client = new OpenAIClient(config(), { fetchImpl, sleep: async () => {} });
  await assert.rejects(() => client.listModels(), OpenAIHttpError);
  assert.equal(calls, 1);
});

test('write and spend-producing POST operations are never blindly retried', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    return new Response(JSON.stringify({ error: { message: 'temporary upstream failure' } }), {
      status: 503,
      headers: { 'content-type': 'application/json' }
    });
  };
  const client = new OpenAIClient(config(), { fetchImpl, sleep: async () => {} });
  await assert.rejects(() => client.createResponse({ model: 'gpt-5.6', input: 'hello', store: false }), OpenAIHttpError);
  assert.equal(calls, 1);
});

test('connector exposes a fixed provider-scoped tool set and no arbitrary request escape hatch', () => {
  assert.equal(TOOL_NAMES.length, 13);
  assert.equal(new Set(TOOL_NAMES).size, TOOL_NAMES.length);
  assert.ok(TOOL_NAMES.every(name => name.startsWith('openai.')));
  assert.ok(!TOOL_NAMES.some(name => /raw|any_api|execute/i.test(name)));
  assert.equal(TOOL_RISK['openai.response.cancel'], 'HIGH_RISK');
  assert.equal(TOOL_RISK['openai.vector_store.search'], 'READ');
});
