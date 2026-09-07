import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';

test('requires an API key and applies secure defaults', () => {
  assert.throws(() => loadConfig({}));
  const config = loadConfig({ BUNNYNET_API_KEY: 'test-key' });
  assert.equal(config.apiBaseUrl, 'https://api.bunny.net');
  assert.equal(config.approvalMode, 'required');
  assert.equal(config.allowDestructive, false);
  assert.equal(config.maxRetries, 3);
});

test('rejects unsafe configuration values', () => {
  assert.throws(() => loadConfig({ BUNNYNET_API_KEY: 'x', BUNNYNET_MAX_RETRIES: '99' }));
  assert.throws(() => loadConfig({ BUNNYNET_API_KEY: 'x', BUNNYNET_ALLOW_DESTRUCTIVE: 'yes' }));
});
