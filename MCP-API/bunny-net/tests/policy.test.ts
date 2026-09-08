import { afterEach, describe, expect, it, vi } from 'vitest';

describe('risk policy', () => {
  afterEach(() => {
    delete process.env.BUNNY_ALLOW_WRITE;
    delete process.env.BUNNY_ALLOW_HIGH_RISK;
    delete process.env.BUNNY_ALLOW_DESTRUCTIVE;
    vi.resetModules();
  });

  it('allows READ automatically', async () => {
    const { enforceRisk } = await import('../src/policy.js');
    expect(() => enforceRisk('READ')).not.toThrow();
  });

  it('denies HIGH_RISK by default', async () => {
    const { enforceRisk } = await import('../src/policy.js');
    expect(() => enforceRisk('HIGH_RISK', true)).toThrow(/disabled/);
  });

  it('requires explicit approval when HIGH_RISK is enabled', async () => {
    process.env.BUNNY_ALLOW_HIGH_RISK = 'true';
    const { enforceRisk } = await import('../src/policy.js');
    expect(() => enforceRisk('HIGH_RISK')).toThrow(/approval/);
    expect(() => enforceRisk('HIGH_RISK', true)).not.toThrow();
  });

  it('keeps DESTRUCTIVE separately disabled', async () => {
    process.env.BUNNY_ALLOW_HIGH_RISK = 'true';
    const { enforceRisk } = await import('../src/policy.js');
    expect(() => enforceRisk('DESTRUCTIVE', true)).toThrow(/disabled/);
  });
});
