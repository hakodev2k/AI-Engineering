import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';

test('configuration requires FAL_KEY', () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /FAL_KEY is required/);
});

test('configuration rejects non-HTTPS or non-fal MCP endpoint', () => {
  assert.throws(() => loadConfig({ FAL_KEY: 'x', FAL_MCP_URL: 'http://mcp.fal.ai/mcp' } as NodeJS.ProcessEnv), /HTTPS/);
  assert.throws(() => loadConfig({ FAL_KEY: 'x', FAL_MCP_URL: 'https://example.com/mcp' } as NodeJS.ProcessEnv), /host must be mcp.fal.ai/);
});

test('read tools do not require approval', () => {
  assert.doesNotThrow(() => authorize('READ', undefined, { requireWriteApproval: true, enableHighRisk: false }));
});

test('write tools require explicit approval by default', () => {
  assert.throws(() => authorize('WRITE', false, { requireWriteApproval: true, enableHighRisk: false }), /APPROVAL_REQUIRED/);
  assert.doesNotThrow(() => authorize('WRITE', true, { requireWriteApproval: true, enableHighRisk: false }));
});

test('high-risk inference is disabled unless explicitly enabled', () => {
  assert.throws(() => authorize('HIGH_RISK', true, { requireWriteApproval: true, enableHighRisk: false }), /HIGH_RISK_DISABLED/);
  assert.throws(() => authorize('HIGH_RISK', false, { requireWriteApproval: true, enableHighRisk: true }), /APPROVAL_REQUIRED/);
  assert.doesNotThrow(() => authorize('HIGH_RISK', true, { requireWriteApproval: true, enableHighRisk: true }));
});

test('timeout bounds are enforced', () => {
  assert.throws(() => loadConfig({ FAL_KEY: 'x', FAL_TOOL_TIMEOUT_MS: '999' } as NodeJS.ProcessEnv), /FAL_TOOL_TIMEOUT_MS/);
  const cfg = loadConfig({ FAL_KEY: 'x', FAL_TOOL_TIMEOUT_MS: '5000' } as NodeJS.ProcessEnv);
  assert.equal(cfg.toolTimeoutMs, 5000);
});
