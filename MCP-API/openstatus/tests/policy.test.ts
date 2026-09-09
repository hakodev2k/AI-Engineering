import { describe, expect, it } from 'vitest';
import { authorize, isRetryableReadError } from '../src/policy.js';

describe('authorization policy', () => {
  it('allows READ without approval', () => {
    expect(() => authorize('READ', undefined, true)).not.toThrow();
  });

  it('requires explicit approval for HIGH_RISK', () => {
    expect(() => authorize('HIGH_RISK', undefined, true)).toThrow('Explicit human approval');
    expect(() => authorize('HIGH_RISK', true, true)).not.toThrow();
  });

  it('never exposes destructive execution', () => {
    expect(() => authorize('DESTRUCTIVE', true, true)).toThrow('not exposed');
  });
});

describe('read retry classification', () => {
  it('recognizes transient failures', () => {
    expect(isRetryableReadError(new Error('429 Too Many Requests'))).toBe(true);
    expect(isRetryableReadError(new Error('503 Service Unavailable'))).toBe(true);
    expect(isRetryableReadError(new Error('ETIMEDOUT'))).toBe(true);
  });

  it('does not retry auth or validation failures', () => {
    expect(isRetryableReadError(new Error('401 Unauthorized'))).toBe(false);
    expect(isRetryableReadError(new Error('400 Validation error'))).toBe(false);
  });
});
