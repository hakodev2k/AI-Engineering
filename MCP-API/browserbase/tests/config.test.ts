import assert from 'node:assert/strict';
import test from 'node:test';
import { loadConfig, validatePublicHttpsUrl } from '../src/config.js';

test('requires API key', () => {
  assert.throws(() => loadConfig({}), /BROWSERBASE_API_KEY/);
});

test('isolates key and validates hosts', () => {
  const cfg = loadConfig({ BROWSERBASE_API_KEY: 'secret', BROWSERBASE_ALLOWED_HOSTS: 'example.com' });
  assert.equal(cfg.apiKey, 'secret');
  assert.equal(validatePublicHttpsUrl(cfg, 'https://example.com/a'), 'https://example.com/a');
  assert.throws(() => validatePublicHttpsUrl(cfg, 'http://example.com'), /HTTPS/);
  assert.throws(() => validatePublicHttpsUrl(cfg, 'https://127.0.0.1'), /private/);
  assert.throws(() => validatePublicHttpsUrl(cfg, 'https://example.org'), /allowlisted/);
});
