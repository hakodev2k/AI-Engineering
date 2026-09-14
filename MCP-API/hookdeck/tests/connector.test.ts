import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { approvalToken, assertWriteApproved } from '../src/policy.js';
import { ALLOWED_UPSTREAM_TOOLS, HookdeckUpstream } from '../src/upstream.js';

test('auth configuration requires an API key and bounds timeout', () => {
  assert.throws(() => loadConfig({}), /HOOKDECK_API_KEY is required/);
  assert.throws(() => loadConfig({ HOOKDECK_API_KEY: 'x', HOOKDECK_MCP_TIMEOUT_MS: '999' }), /between/);
  const cfg = loadConfig({ HOOKDECK_API_KEY: 'test_key', HOOKDECK_MCP_TIMEOUT_MS: '5000' });
  assert.equal(cfg.apiKey, 'test_key');
  assert.equal(cfg.timeoutMs, 5000);
  assert.equal(cfg.enableWrites, false);
});

test('upstream MCP surface is explicitly allowlisted', () => {
  assert.equal(ALLOWED_UPSTREAM_TOOLS.has('hookdeck_events'), true);
  assert.equal(ALLOWED_UPSTREAM_TOOLS.has('hookdeck_connections'), true);
  assert.equal(ALLOWED_UPSTREAM_TOOLS.has('hookdeck_login'), false);
  assert.equal(ALLOWED_UPSTREAM_TOOLS.has('execute_any_api_request'), false);
});

test('unknown upstream tool is denied before subprocess connection', async () => {
  const upstream = new HookdeckUpstream({ apiKey: 'test', command: 'does-not-run', timeoutMs: 1000, enableWrites: false });
  await assert.rejects(() => upstream.call('not_allowed', {}), /not allowlisted/);
});

test('writes are denied by default', () => {
  const cfg = { apiKey: 'test', command: 'hookdeck', timeoutMs: 1000, enableWrites: false, approvalSecret: 'secret' };
  assert.throws(() => assertWriteApproved(cfg, 'hookdeck.connection.pause', { id: 'web_123' }, '0'.repeat(64)), /disabled/);
});

test('write approval is action and payload bound', () => {
  const cfg = { apiKey: 'test', command: 'hookdeck', timeoutMs: 1000, enableWrites: true, approvalSecret: 'unit-test-secret' };
  const args = { id: 'web_123' };
  const token = approvalToken(cfg.approvalSecret, 'hookdeck.connection.pause', args);
  assert.doesNotThrow(() => assertWriteApproved(cfg, 'hookdeck.connection.pause', args, token));
  assert.throws(() => assertWriteApproved(cfg, 'hookdeck.connection.unpause', args, token), /invalid/);
  assert.throws(() => assertWriteApproved(cfg, 'hookdeck.connection.pause', { id: 'web_999' }, token), /invalid/);
});
