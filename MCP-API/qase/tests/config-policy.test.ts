import test from 'node:test';
import assert from 'node:assert/strict';
import { assertProjectAllowed, loadConfig } from '../src/config.js';
import { approvalFor, assertApproval } from '../src/policy.js';
import { QaseUpstream } from '../src/upstream.js';

const baseEnv = {
  QASE_API_TOKEN: 'test-token',
  QASE_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef',
  QASE_ALLOWED_PROJECTS: 'DEMO,CORE',
  QASE_UPSTREAM_TIMEOUT_MS: '20000'
};

test('configuration requires credentials and validates timeout', () => {
  assert.throws(() => loadConfig({}), /QASE_API_TOKEN/);
  assert.throws(() => loadConfig({ ...baseEnv, QASE_UPSTREAM_TIMEOUT_MS: '10' }), /1000\.\.120000/);
  const cfg = loadConfig(baseEnv);
  assert.equal(cfg.apiToken, 'test-token');
  assert.deepEqual([...cfg.allowedProjects], ['DEMO', 'CORE']);
});

test('project allowlist blocks cross-project access', () => {
  const cfg = loadConfig(baseEnv);
  assert.doesNotThrow(() => assertProjectAllowed(cfg, 'demo'));
  assert.throws(() => assertProjectAllowed(cfg, 'SECRET'), /not allowlisted/);
  assert.throws(() => assertProjectAllowed(cfg, '../DEMO'), /Invalid Qase project code/);
});

test('write approval is bound to exact tool and payload', () => {
  const secret = baseEnv.QASE_APPROVAL_SECRET;
  const payload = { code: 'DEMO', title: 'Login works' };
  const token = approvalFor('qase.case.save', payload, secret);
  assert.doesNotThrow(() => assertApproval('qase.case.save', payload, token, secret));
  assert.throws(() => assertApproval('qase.case.save', { ...payload, title: 'Changed' }, token, secret), /Invalid approval/);
  assert.throws(() => assertApproval('qase.run.save', payload, token, secret), /Invalid approval/);
});

test('read tools do not require approvals', () => {
  assert.doesNotThrow(() => assertApproval('qase.qql.search', { query: 'case' }, undefined, baseEnv.QASE_APPROVAL_SECRET));
});

test('upstream rejects non-allowlisted tools before spawning a process', async () => {
  const cfg = loadConfig(baseEnv);
  const upstream = new QaseUpstream(cfg);
  await assert.rejects(() => upstream.call('qase_api', {}), /not allowlisted/);
});
