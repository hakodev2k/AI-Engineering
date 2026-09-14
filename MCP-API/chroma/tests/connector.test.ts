import assert from 'node:assert/strict';
import test from 'node:test';
import { loadConfig } from '../src/config.js';
import { approvalToken, assertApproval, TOOL_POLICIES } from '../src/policy.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';
import { validateBatch, validateCollectionName, validatePage } from '../src/validation.js';

const approvalSecret = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

function baseEnv(): NodeJS.ProcessEnv {
  return {
    CHROMA_CLIENT_TYPE: 'cloud',
    CHROMA_TENANT: 'test-tenant',
    CHROMA_DATABASE: 'test-database',
    CHROMA_API_KEY: 'test-value',
    CHROMA_APPROVAL_SECRET: approvalSecret,
    CHROMA_REQUIRE_WRITE_APPROVAL: 'true',
    CHROMA_ENABLE_DESTRUCTIVE: 'false'
  };
}

test('cloud configuration validates required values and keeps policy secret out of upstream env', () => {
  const config = loadConfig(baseEnv());
  assert.equal(config.clientType, 'cloud');
  assert.equal(config.upstreamEnv.CHROMA_API_KEY, 'test-value');
  assert.equal(config.upstreamEnv.CHROMA_APPROVAL_SECRET, undefined);
  assert.equal(config.maxDocumentsPerCall, 100);
  assert.throws(() => loadConfig({ CHROMA_CLIENT_TYPE: 'cloud', CHROMA_APPROVAL_SECRET: approvalSecret }), /CHROMA_TENANT/);
});

test('write approval is scoped to operation and collection', () => {
  const config = loadConfig(baseEnv());
  const token = approvalToken(approvalSecret, 'chroma.document.add', 'knowledge');
  assert.doesNotThrow(() => assertApproval(config, 'chroma.document.add', 'knowledge', token));
  assert.throws(() => assertApproval(config, 'chroma.document.add', 'other', token), /Approval denied/);
  assert.throws(() => assertApproval(config, 'chroma.collection.create', 'knowledge', token), /Approval denied/);
});

test('destructive tools stay disabled until explicitly enabled', () => {
  const config = loadConfig(baseEnv());
  const token = approvalToken(approvalSecret, 'chroma.collection.delete', 'knowledge');
  assert.throws(() => assertApproval(config, 'chroma.collection.delete', 'knowledge', token), /disabled/);
  const enabled = loadConfig({ ...baseEnv(), CHROMA_ENABLE_DESTRUCTIVE: 'true' });
  assert.doesNotThrow(() => assertApproval(enabled, 'chroma.collection.delete', 'knowledge', token));
});

test('validation rejects malformed or oversized inputs', () => {
  assert.doesNotThrow(() => validateCollectionName('knowledge-base_1'));
  assert.throws(() => validateCollectionName('../secret'), /Collection name/);
  assert.throws(() => validateBatch(['a', 'b'], 100, ['only-one']), /documents length/);
  assert.throws(() => validateBatch(['a', 'a'], 100), /unique/);
  assert.throws(() => validatePage(501, 0), /limit/);
});

test('upstream tool surface is fixed and every external tool has a risk policy', () => {
  assert.equal(ALLOWED_UPSTREAM_TOOLS.size, 13);
  assert.equal(Object.keys(TOOL_POLICIES).length, 13);
  assert(ALLOWED_UPSTREAM_TOOLS.has('chroma_query_documents'));
  assert(!ALLOWED_UPSTREAM_TOOLS.has('execute_any_api_request'));
  assert.equal(TOOL_POLICIES['chroma.collection.delete']?.risk, 'DESTRUCTIVE');
  assert.equal(TOOL_POLICIES['chroma.document.query']?.risk, 'READ');
});

test('write approval can be disabled without enabling destructive operations', () => {
  const config = loadConfig({ ...baseEnv(), CHROMA_REQUIRE_WRITE_APPROVAL: 'false' });
  assert.doesNotThrow(() => assertApproval(config, 'chroma.document.add', 'knowledge'));
  assert.throws(() => assertApproval(config, 'chroma.document.delete', 'knowledge'), /disabled/);
});
