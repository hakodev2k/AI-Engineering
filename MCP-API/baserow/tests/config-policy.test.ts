import assert from 'node:assert/strict';
import test from 'node:test';
import { assertTableAllowed, loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval, assertDeleteEnabled, assertWriteApproval } from '../src/policy.js';

const env = {
  BASEROW_BASE_URL: 'https://api.baserow.io',
  BASEROW_DATABASE_TOKEN: 'test-token',
  BASEROW_ALLOWED_TABLE_IDS: '10,20',
  BASEROW_REQUIRE_WRITE_APPROVAL: 'true',
  BASEROW_ENABLE_DELETE: 'false',
  BASEROW_APPROVAL_SECRET: 'approval-secret',
  BASEROW_TIMEOUT_MS: '5000',
  BASEROW_MAX_RETRIES: '2'
} as NodeJS.ProcessEnv;

test('loadConfig validates and parses least-privilege settings', () => {
  const config = loadConfig(env);
  assert.equal(config.baseUrl.href, 'https://api.baserow.io/');
  assert.deepEqual([...config.allowedTableIds], [10, 20]);
  assert.equal(config.requireWriteApproval, true);
  assert.equal(config.enableDelete, false);
});

test('table allowlist denies unknown tables', () => {
  const config = loadConfig(env);
  assert.doesNotThrow(() => assertTableAllowed(config, 10));
  assert.throws(() => assertTableAllowed(config, 99), /not allowed/);
});

test('write approval is bound to tool and resource', () => {
  const config = loadConfig(env);
  const approval = approvalDigest('approval-secret', 'baserow.row.update', 'table:10:row:5');
  assert.doesNotThrow(() => assertWriteApproval(config, 'baserow.row.update', 'table:10:row:5', approval));
  assert.throws(() => assertWriteApproval(config, 'baserow.row.update', 'table:10:row:6', approval), /Invalid approval/);
});

test('destructive delete is disabled independently of approval', () => {
  const config = loadConfig(env);
  const approval = approvalDigest('approval-secret', 'baserow.row.delete', 'table:10:row:5');
  assert.doesNotThrow(() => assertApproval(config, 'baserow.row.delete', 'table:10:row:5', approval));
  assert.throws(() => assertDeleteEnabled(config), /disabled/);
});

test('non-HTTPS remote base URL is rejected', () => {
  assert.throws(() => loadConfig({ ...env, BASEROW_BASE_URL: 'http://example.com' }), /HTTPS/);
});
