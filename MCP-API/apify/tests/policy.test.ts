import { afterEach, describe, expect, it, vi } from 'vitest';

describe('permission policy', () => {
  afterEach(() => {
    delete process.env.APIFY_ALLOW_WRITE;
    delete process.env.APIFY_ALLOW_HIGH_RISK;
    delete process.env.APIFY_ALLOW_DESTRUCTIVE;
    vi.resetModules();
  });

  it('allows READ without approval', async () => {
    const { requirePermission } = await import('../src/policy.js');
    expect(() => requirePermission('read', 'READ')).not.toThrow();
  });

  it('denies writes by default', async () => {
    const { requirePermission } = await import('../src/policy.js');
    expect(() => requirePermission('apify.actor.run', 'HIGH_RISK', 'APPROVE_PAID_EXECUTION')).toThrow(/WRITE operations are disabled/);
  });

  it('requires exact high-risk approval', async () => {
    process.env.APIFY_ALLOW_WRITE = 'true';
    process.env.APIFY_ALLOW_HIGH_RISK = 'true';
    vi.resetModules();
    const { requirePermission } = await import('../src/policy.js');
    expect(() => requirePermission('apify.actor.run', 'HIGH_RISK', 'yes')).toThrow(/APPROVE_PAID_EXECUTION/);
    expect(() => requirePermission('apify.actor.run', 'HIGH_RISK', 'APPROVE_PAID_EXECUTION')).not.toThrow();
  });

  it('keeps destructive actions independently disabled', async () => {
    process.env.APIFY_ALLOW_WRITE = 'true';
    process.env.APIFY_ALLOW_HIGH_RISK = 'true';
    vi.resetModules();
    const { requirePermission } = await import('../src/policy.js');
    expect(() => requirePermission('apify.webhook.delete', 'DESTRUCTIVE', 'APPROVE_DELETE')).toThrow(/DESTRUCTIVE/);
  });

  it('blocks local and private webhook targets', async () => {
    const { validateWebhookUrl } = await import('../src/policy.js');
    expect(() => validateWebhookUrl('http://example.com/hook')).toThrow(/HTTPS/);
    expect(() => validateWebhookUrl('https://127.0.0.1/hook')).toThrow(/Private/);
    expect(() => validateWebhookUrl('https://10.0.0.1/hook')).toThrow(/Private/);
    expect(validateWebhookUrl('https://example.com/hook').hostname).toBe('example.com');
  });
});
