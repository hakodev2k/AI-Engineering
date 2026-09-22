import test from 'node:test';
import assert from 'node:assert/strict';
import {loadConfig} from '../src/config.js';
import {allowedUpstreamTools} from '../src/upstream.js';

test('requires cluster URL',()=>assert.throws(()=>loadConfig({}),/OPENSEARCH_URL/));
test('rejects non-http URL',()=>assert.throws(()=>loadConfig({OPENSEARCH_URL:'file:///tmp/x'}),/http/));
test('requires complete basic credentials',()=>assert.throws(()=>loadConfig({OPENSEARCH_URL:'https://example.test',OPENSEARCH_USERNAME:'u'}),/Both/));
test('bearer auth remains isolated in connector headers',()=>{const c=loadConfig({OPENSEARCH_URL:'https://example.test',OPENSEARCH_BEARER_TOKEN:'secret'});assert.equal(c.headers.Authorization,'Bearer secret');assert.equal((c as any).token,undefined);});
test('timeout is bounded',()=>assert.throws(()=>loadConfig({OPENSEARCH_URL:'https://example.test',OPENSEARCH_TIMEOUT_MS:'999999'}),/between/));
test('upstream MCP allowlist excludes generic arbitrary API tool',()=>{const names=allowedUpstreamTools();assert.equal(names.length,8);assert.equal(names.includes('GenericOpenSearchApiTool'),false);assert.ok(names.includes('SearchIndexTool'));});
