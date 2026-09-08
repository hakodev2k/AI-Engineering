import { describe, expect, it, vi } from 'vitest';

describe('approval policy', () => {
  it('blocks high-risk operations unless explicitly enabled and approved', async () => {
    vi.stubEnv('UPCLOUD_ALLOW_HIGH_RISK', 'false');
    vi.resetModules();
    const { requirePermission } = await import('../src/policy.js');
    expect(() => requirePermission('HIGH_RISK', true)).toThrow(/disabled/i);
  });

  it('allows READ without approval', async () => {
    vi.resetModules();
    const { requirePermission } = await import('../src/policy.js');
    expect(() => requirePermission('READ', false)).not.toThrow();
  });

  it('requires approval for destructive actions even when enabled', async () => {
    vi.stubEnv('UPCLOUD_ALLOW_DESTRUCTIVE', 'true');
    vi.resetModules();
    const { requirePermission } = await import('../src/policy.js');
    expect(() => requirePermission('DESTRUCTIVE', false)).toThrow(/approval/i);
  });
});
