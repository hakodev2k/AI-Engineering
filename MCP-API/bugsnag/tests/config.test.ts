import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, upstreamEnv } from '../src/config.js';

test('requires BugSnag auth token', () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv));
});

test('keeps credentials in upstream environment rather than tool arguments', () => {
  const cfg = loadConfig({
    BUGSNAG_AUTH_TOKEN: 'secret-token',
    BUGSNAG_PROJECT_API_KEY: 'project-key',
    BUGSNAG_REQUIRE_WRITE_APPROVAL: 'true'
  } as NodeJS.ProcessEnv);
  const env = upstreamEnv(cfg);
  assert.equal(env.BUGSNAG_AUTH_TOKEN, 'secret-token');
  assert.equal(env.BUGSNAG_PROJECT_API_KEY, 'project-key');
  assert.equal(cfg.BUGSNAG_REQUIRE_WRITE_APPROVAL, true);
});

test('rejects unsafe timeout configuration', () => {
  assert.throws(() => loadConfig({ BUGSNAG_AUTH_TOKEN: 'x', BUGSNAG_TOOL_TIMEOUT_MS: '10' } as NodeJS.ProcessEnv));
});
