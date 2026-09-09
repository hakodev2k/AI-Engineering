import test from 'node:test';
import assert from 'node:assert/strict';
import { ApprovalRequiredError, authorize } from '../src/policy.js';

const strict = { requireWriteApproval: true };

test('READ operations execute without approval', () => {
  assert.doesNotThrow(() => authorize('READ', undefined, strict));
});

test('WRITE operations require approval by default', () => {
  assert.throws(() => authorize('WRITE', false, strict), ApprovalRequiredError);
  assert.doesNotThrow(() => authorize('WRITE', true, strict));
});

test('WRITE approval can be disabled by configuration', () => {
  assert.doesNotThrow(() => authorize('WRITE', undefined, { requireWriteApproval: false }));
});

test('DESTRUCTIVE operations remain unavailable even when approved', () => {
  assert.throws(() => authorize('DESTRUCTIVE', true, strict), /not exposed/i);
});
