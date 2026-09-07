import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';

test('requires credential and pins trusted endpoints', () => {
  assert.throws(() => loadConfig({}), /CODA_API_TOKEN/);
  assert.throws(() => loadConfig({CODA_API_TOKEN:'x',CODA_API_BASE_URL:'https://evil.example/api'}), /exactly/);
  const c = loadConfig({CODA_API_TOKEN:'secret',CODA_APPROVAL_TOKEN:'1234567890123456'});
  assert.equal(c.apiBaseUrl, 'https://coda.io/apis/v1');
  assert.equal(c.mcpUrl, 'https://coda.io/apis/mcp');
  assert.equal(c.allowWrites, false);
});
