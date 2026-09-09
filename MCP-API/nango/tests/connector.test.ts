import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';
import { toolDefs } from '../src/tools.js';

test('configuration requires a secret key', () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /NANGO_SECRET_KEY/);
});

test('configuration rejects arbitrary MCP hosts', () => {
  assert.throws(() => loadConfig({ NANGO_SECRET_KEY: 'x', NANGO_MANAGEMENT_MCP_URL: 'https://evil.example/mcp' } as NodeJS.ProcessEnv), /mcp.nango.dev/);
});

test('read tools do not require approval', () => {
  assert.doesNotThrow(() => authorize('READ', undefined, true));
});

test('write tools require explicit approval by default', () => {
  assert.throws(() => authorize('WRITE', false, true), /APPROVAL_REQUIRED/);
  assert.doesNotThrow(() => authorize('WRITE', true, true));
});

test('destructive operations are not exposed', () => {
  assert.throws(() => authorize('DESTRUCTIVE', true, true), /DESTRUCTIVE_NOT_EXPOSED/);
  assert.equal(toolDefs.some((t) => t.risk === 'DESTRUCTIVE'), false);
});

test('only reviewed upstream tools are allowlisted', () => {
  assert.equal(ALLOWED_UPSTREAM_TOOLS.size, 7);
  for (const d of toolDefs) assert.ok(ALLOWED_UPSTREAM_TOOLS.has(d.upstream));
});

test('connect session validates bounded integration list', () => {
  const def = toolDefs.find((t) => t.name === 'nango.connect_session.create')!;
  assert.throws(() => def.schema.parse({ allowed_integrations: [] }));
  assert.doesNotThrow(() => def.schema.parse({ allowed_integrations: ['slack'], tags: { end_user_id: 'u-1' }, approved: true }));
});

test('connection listing schema rejects unknown parameters', () => {
  const def = toolDefs.find((t) => t.name === 'nango.connection.list')!;
  assert.throws(() => def.schema.parse({ raw_request: '/anything' }));
});
