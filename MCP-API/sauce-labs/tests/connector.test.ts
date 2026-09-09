import test from 'node:test';
import assert from 'node:assert/strict';
import { basicAuthorization, loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';

test('configuration requires credentials', () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /SAUCE_USERNAME/);
  assert.throws(() => loadConfig({ SAUCE_USERNAME: 'user' } as NodeJS.ProcessEnv), /SAUCE_ACCESS_KEY/);
});

test('configuration validates region and HTTPS MCP endpoint', () => {
  const base = { SAUCE_USERNAME: 'user', SAUCE_ACCESS_KEY: 'key' } as NodeJS.ProcessEnv;
  assert.throws(() => loadConfig({ ...base, SAUCE_REGION: 'MARS' }), /SAUCE_REGION/);
  assert.throws(() => loadConfig({ ...base, SAUCE_MCP_URL: 'http://mcp.saucelabs.com' }), /HTTPS/);
});

test('basic auth header is correctly constructed', () => {
  assert.equal(basicAuthorization({ username: 'u', accessKey: 'k' }), `Basic ${Buffer.from('u:k').toString('base64')}`);
});

test('read policy executes without approval', () => {
  assert.doesNotThrow(() => authorize('READ', undefined, { requireWriteApproval: true, destructiveEnabled: false }));
});

test('write and destructive policy deny unsafe execution', () => {
  assert.throws(() => authorize('WRITE', false, { requireWriteApproval: true, destructiveEnabled: false }), /APPROVAL_REQUIRED/);
  assert.throws(() => authorize('DESTRUCTIVE', true, { requireWriteApproval: true, destructiveEnabled: false }), /DESTRUCTIVE_DISABLED/);
});

test('upstream MCP allowlist contains only curated tools', () => {
  assert.equal(ALLOWED_UPSTREAM_TOOLS.size, 12);
  assert.ok(ALLOWED_UPSTREAM_TOOLS.has('get_account_info'));
  assert.ok(ALLOWED_UPSTREAM_TOOLS.has('listDevices'));
  assert.ok(!ALLOWED_UPSTREAM_TOOLS.has('executeShellCommand'));
  assert.ok(!ALLOWED_UPSTREAM_TOOLS.has('removeFile'));
  assert.ok(!ALLOWED_UPSTREAM_TOOLS.has('Delete_a_test_suite'));
});
