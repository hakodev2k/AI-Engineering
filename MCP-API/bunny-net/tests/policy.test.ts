import test from 'node:test';
import assert from 'node:assert/strict';
import { assertAllowed, PolicyError } from '../src/policy.js';

test('READ is allowed without approval', () => {
  assert.doesNotThrow(() => assertAllowed('READ', {}, { approvalMode: 'required', allowDestructive: false }));
});

test('HIGH_RISK requires explicit approval', () => {
  assert.throws(() => assertAllowed('HIGH_RISK', { approved: false }, { approvalMode: 'required', allowDestructive: false }), PolicyError);
  assert.doesNotThrow(() => assertAllowed('HIGH_RISK', { approved: true }, { approvalMode: 'required', allowDestructive: false }));
});

test('DESTRUCTIVE is disabled by default and requires strong approval token when enabled', () => {
  assert.throws(() => assertAllowed('DESTRUCTIVE', { approved: true, approvalToken: 'abcdefgh' }, { approvalMode: 'required', allowDestructive: false }), /disabled/);
  assert.throws(() => assertAllowed('DESTRUCTIVE', { approved: true, approvalToken: 'short' }, { approvalMode: 'required', allowDestructive: true }), /approval token/);
  assert.doesNotThrow(() => assertAllowed('DESTRUCTIVE', { approved: true, approvalToken: 'operator-approved' }, { approvalMode: 'required', allowDestructive: true }));
});
