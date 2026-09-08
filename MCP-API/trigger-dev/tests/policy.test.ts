import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('approval policy', () => {
  beforeEach(() => {
    process.env.TRIGGER_ALLOW_WRITE = 'false';
    process.env.TRIGGER_ALLOW_HIGH_RISK = 'false';
    vi.resetModules();
  });
  it('permits reads', async () => {
    const { requireRisk } = await import('../src/policy.js');
    expect(() => requireRisk('READ')).not.toThrow();
  });
  it('denies unapproved writes', async () => {
    const { requireRisk } = await import('../src/policy.js');
    expect(() => requireRisk('WRITE', false)).toThrow(/approval/);
  });
  it('requires both high-risk enablement and approval', async () => {
    process.env.TRIGGER_ALLOW_HIGH_RISK = 'true';
    vi.resetModules();
    const { requireRisk } = await import('../src/policy.js');
    expect(() => requireRisk('HIGH_RISK', false)).toThrow();
    expect(() => requireRisk('HIGH_RISK', true)).not.toThrow();
  });
});
