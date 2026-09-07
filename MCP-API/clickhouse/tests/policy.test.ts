import test from 'node:test';
import assert from 'node:assert/strict';
import { assertReadonlyQuery, quoteQualifiedTable, requireDestructive, requireWrite } from '../src/policy.js';

const config = {
  url:'https://localhost:8443', username:'default', password:'', database:'default',
  requestTimeoutMs:30000, maxExecutionTimeSeconds:30, maxResultRows:1000,
  allowWrites:false, allowDestructive:false
};

test('readonly query accepts SELECT and WITH', () => {
  assert.doesNotThrow(() => assertReadonlyQuery('SELECT 1'));
  assert.doesNotThrow(() => assertReadonlyQuery('WITH 1 AS x SELECT x'));
});

test('readonly query rejects mutations and multi-statements', () => {
  assert.throws(() => assertReadonlyQuery('DROP TABLE users'));
  assert.throws(() => assertReadonlyQuery('SELECT 1; DROP TABLE users'));
  assert.throws(() => assertReadonlyQuery('WITH x AS (SELECT 1) INSERT INTO t SELECT * FROM x'));
});

test('identifiers are strictly validated', () => {
  assert.equal(quoteQualifiedTable('analytics.events','default'),'`analytics`.`events`');
  assert.throws(() => quoteQualifiedTable('analytics.events;DROP','default'));
});

test('write approval is enforced when writes disabled', () => {
  assert.throws(() => requireWrite(config, {}), /WRITE_APPROVAL_REQUIRED/);
  assert.doesNotThrow(() => requireWrite(config, { approved:true }));
});

test('destructive operations require both feature flag and explicit approval', () => {
  assert.throws(() => requireDestructive(config, { approved:true }), /DESTRUCTIVE_DISABLED/);
  assert.throws(() => requireDestructive({ ...config, allowDestructive:true }, {}), /DESTRUCTIVE_APPROVAL_REQUIRED/);
});
