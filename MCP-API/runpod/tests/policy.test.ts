import test from 'node:test';
import assert from 'node:assert/strict';
import { approvalFor, assertApproval, TOOL_RISKS } from '../src/policy.js';
import { loadConfig } from '../src/config.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';

test('configuration requires credentials and validates timeout', () => {
  assert.throws(() => loadConfig({}), /RUNPOD_API_KEY/);
  assert.throws(() => loadConfig({ RUNPOD_API_KEY: 'rpa_test' }), /RUNPOD_APPROVAL_SECRET/);
  assert.throws(() => loadConfig({ RUNPOD_API_KEY: 'rpa_test', RUNPOD_APPROVAL_SECRET: 'secret', RUNPOD_UPSTREAM_TIMEOUT_MS: '99' }), /between 1000 and 120000/);
  assert.equal(loadConfig({ RUNPOD_API_KEY: 'rpa_test', RUNPOD_APPROVAL_SECRET: 'secret' }).timeoutMs, 20000);
});

test('write approval is deterministic and rejects missing/invalid values', () => {
  const token = approvalFor('runpod.pod.create', 'secret');
  assert.equal(token.length, 64);
  assert.doesNotThrow(() => assertApproval('runpod.pod.create', token, 'secret'));
  assert.throws(() => assertApproval('runpod.pod.create', undefined, 'secret'), /Human approval required/);
  assert.throws(() => assertApproval('runpod.pod.create', '0'.repeat(64), 'secret'), /Invalid approval/);
});

test('surface has no destructive tool and upstream is fixed allowlist', () => {
  assert.equal(Object.values(TOOL_RISKS).includes('DESTRUCTIVE'), false);
  assert.equal(ALLOWED_UPSTREAM_TOOLS.has('delete-pod'), false);
  assert.equal(ALLOWED_UPSTREAM_TOOLS.has('purge-endpoint-queue'), false);
  assert.equal(ALLOWED_UPSTREAM_TOOLS.has('create-pod'), true);
  assert.equal(ALLOWED_UPSTREAM_TOOLS.has('list-gpu-types'), true);
});
