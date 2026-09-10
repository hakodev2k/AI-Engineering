import { describe, expect, it } from 'vitest';
import { approvalDigest, assertPolicy } from '../src/policy.js';
import type { Config } from '../src/config.js';

const config: Config = { apiToken: 'token', apiBaseUrl: 'https://api.pingdom.com/api/3.1', timeoutMs: 1000, maxReadRetries: 0, approvalSecret: 'x'.repeat(32), enableDestructive: false };

describe('policy', () => {
  it('allows reads without approval', () => expect(() => assertPolicy(config, 'pingdom.check.list', {})).not.toThrow());
  it('requires argument-bound approval for writes', () => {
    const clean = { name: 'api', hostname: 'example.com' };
    expect(() => assertPolicy(config, 'pingdom.check.create', clean)).toThrow(/approval/);
    const approval = approvalDigest(config.approvalSecret, 'pingdom.check.create', clean);
    expect(() => assertPolicy(config, 'pingdom.check.create', { ...clean, approval })).not.toThrow();
  });
  it('keeps destructive operations disabled by default', () => {
    const clean = { checkId: 42 };
    const approval = approvalDigest(config.approvalSecret, 'pingdom.check.delete', clean);
    expect(() => assertPolicy(config, 'pingdom.check.delete', { ...clean, approval })).toThrow(/disabled/);
  });
});
