import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  process.env.SCW_ALLOW_WRITE = 'false';
  process.env.SCW_ALLOW_HIGH_RISK = 'false';
});

describe('risk policy', () => {
  it('allows READ without approval', async () => {
    const { enforceRisk } = await import('../src/policy.js');
    expect(() => enforceRisk('READ')).not.toThrow();
  });

  it('blocks HIGH_RISK when disabled', async () => {
    const { enforceRisk } = await import('../src/policy.js');
    expect(() => enforceRisk('HIGH_RISK', { approved: true })).toThrow(/disabled/i);
  });

  it('requires approval when HIGH_RISK is enabled', async () => {
    process.env.SCW_ALLOW_HIGH_RISK = 'true';
    vi.resetModules();
    const { enforceRisk } = await import('../src/policy.js');
    expect(() => enforceRisk('HIGH_RISK', { approved: false })).toThrow(/approval/i);
    expect(() => enforceRisk('HIGH_RISK', { approved: true })).not.toThrow();
  });
});
