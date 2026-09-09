import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';

test('loads safe US defaults', () => {
  const c = loadConfig({ HONEYBADGER_PERSONAL_AUTH_TOKEN: 'test-token' });
  assert.equal(c.apiUrl, 'https://app.honeybadger.io');
  assert.equal(c.requireWriteApproval, true);
  assert.equal(c.destructiveEnabled, false);
});

test('selects EU API for EU region', () => {
  const c = loadConfig({ HONEYBADGER_PERSONAL_AUTH_TOKEN: 'test-token', HONEYBADGER_REGION: 'eu' });
  assert.equal(c.apiUrl, 'https://eu-app.honeybadger.io');
});

test('rejects arbitrary API hosts to prevent SSRF', () => {
  assert.throws(() => loadConfig({ HONEYBADGER_PERSONAL_AUTH_TOKEN: 'test-token', HONEYBADGER_API_URL: 'https://example.com' }), /must be/);
});
