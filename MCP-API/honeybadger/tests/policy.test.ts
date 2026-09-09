import test from 'node:test';
import assert from 'node:assert/strict';
import { authorize, assertMutatingInput } from '../src/policy.js';

test('READ executes without approval', () => {
  assert.doesNotThrow(() => authorize('READ', undefined, { requireWriteApproval: true, destructiveEnabled: false }));
});

test('WRITE requires approval by default', () => {
  assert.throws(() => authorize('WRITE', false, { requireWriteApproval: true, destructiveEnabled: false }), /approval/i);
  assert.doesNotThrow(() => authorize('WRITE', true, { requireWriteApproval: true, destructiveEnabled: false }));
});

test('DESTRUCTIVE is disabled unless explicitly enabled and approved', () => {
  assert.throws(() => authorize('DESTRUCTIVE', true, { requireWriteApproval: true, destructiveEnabled: false }), /disabled/i);
  assert.throws(() => authorize('DESTRUCTIVE', false, { requireWriteApproval: true, destructiveEnabled: true }), /approval/i);
  assert.doesNotThrow(() => authorize('DESTRUCTIVE', true, { requireWriteApproval: true, destructiveEnabled: true }));
});

test('mutating requests require at least one changed field', () => {
  assert.throws(() => assertMutatingInput({ approved: true }, ['name','resolved']), /mutable field/i);
  assert.doesNotThrow(() => assertMutatingInput({ resolved: false }, ['name','resolved']));
});
