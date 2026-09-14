import assert from 'node:assert/strict';
import test from 'node:test';
import { assertEnabled, loadConfig } from '../src/config.js';

test('requires API key', () => {
  assert.throws(() => loadConfig({}), /PERPLEXITY_API_KEY is required/);
});

test('loads secure defaults without exposing credential', () => {
  const config = loadConfig({ PERPLEXITY_API_KEY: 'test-secret' });
  assert.equal(config.mcpUrl.href, 'https://api.perplexity.ai/mcp');
  assert.equal(config.apiBaseUrl.href, 'https://api.perplexity.ai/');
  assert.equal(config.timeoutMs, 20000);
  assert.equal(config.allowedTools.has('research'), true);
});

test('rejects custom hosts to prevent SSRF', () => {
  assert.throws(() => loadConfig({
    PERPLEXITY_API_KEY: 'x',
    PERPLEXITY_API_BASE_URL: 'https://example.com'
  }), /only api\.perplexity\.ai is allowed/);
});

test('rejects unknown policy capabilities', () => {
  assert.throws(() => loadConfig({
    PERPLEXITY_API_KEY: 'x',
    PERPLEXITY_ALLOWED_TOOLS: 'search,admin_anything'
  }), /Unknown tool policy entry/);
});

test('disabled capabilities fail closed', () => {
  const config = loadConfig({
    PERPLEXITY_API_KEY: 'x',
    PERPLEXITY_ALLOWED_TOOLS: 'search'
  });
  assert.doesNotThrow(() => assertEnabled(config, 'search'));
  assert.throws(() => assertEnabled(config, 'research'), /disabled/);
});
