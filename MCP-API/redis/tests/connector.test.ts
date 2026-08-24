import { describe, expect, it } from 'vitest';
import { assertKeyAllowed, loadConfig } from '../src/config.js';
import { assertDestructiveApproval, assertWriteApproval, makeApprovalId } from '../src/policy.js';

describe('Redis connector config and policy', () => {
  it('requires REDIS_URL', () => expect(() => loadConfig({})).toThrow(/REDIS_URL/));
  it('enforces allowed key prefixes', () => {
    const c = loadConfig({ REDIS_URL: 'redis://localhost:6379', REDIS_ALLOWED_KEY_PREFIXES: 'app:,cache:' });
    expect(() => assertKeyAllowed(c, 'app:user:1')).not.toThrow();
    expect(() => assertKeyAllowed(c, 'other:key')).toThrow(/outside configured prefixes/);
  });
  it('requires HMAC approval for writes', () => {
    const c = loadConfig({ REDIS_URL: 'redis://localhost:6379', REDIS_APPROVAL_SECRET: 'secret' });
    expect(() => assertWriteApproval(c, 'redis.key.set')).toThrow(/requires explicit approval/);
    expect(() => assertWriteApproval(c, 'redis.key.set', makeApprovalId('secret', 'redis.key.set'))).not.toThrow();
  });
  it('keeps destructive actions disabled by default', () => {
    const c = loadConfig({ REDIS_URL: 'redis://localhost:6379', REDIS_DESTRUCTIVE_APPROVAL_SECRET: 'danger' });
    expect(() => assertDestructiveApproval(c, 'redis.key.delete', makeApprovalId('danger', 'redis.key.delete'))).toThrow(/disabled by default/);
  });
  it('requires independent strong approval for delete', () => {
    const c = loadConfig({ REDIS_URL: 'redis://localhost:6379', REDIS_ALLOW_DESTRUCTIVE: 'true', REDIS_DESTRUCTIVE_APPROVAL_SECRET: 'danger' });
    expect(() => assertDestructiveApproval(c, 'redis.key.delete', makeApprovalId('danger', 'redis.key.delete'))).not.toThrow();
  });
});
