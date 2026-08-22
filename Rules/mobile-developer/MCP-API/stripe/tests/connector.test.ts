import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import { loadConfig } from '../src/config.js';
import { assertApproval, TOOL_RISK } from '../src/policy.js';

describe('stripe connector policy', () => {
  it('rejects live keys unless explicitly enabled', () => {
    expect(() => loadConfig({ STRIPE_API_KEY: 'rk_live_1234567890', STRIPE_LIVE_MODE_ALLOWED: 'false' } as NodeJS.ProcessEnv)).toThrow(/Live-mode/);
  });

  it('accepts sandbox restricted keys by default', () => {
    const cfg = loadConfig({ STRIPE_API_KEY: 'rk_test_1234567890' } as NodeJS.ProcessEnv);
    expect(cfg.liveModeAllowed).toBe(false);
  });

  it('allows reads without approval', () => {
    expect(() => assertApproval('stripe.customer.list', undefined, undefined)).not.toThrow();
  });

  it('requires approval for writes', () => {
    expect(() => assertApproval('stripe.customer.create', undefined, '1234567890123456')).toThrow(/requires explicit approval/);
  });

  it('accepts a valid out-of-band approval token', () => {
    const secret = '1234567890123456';
    const token = createHmac('sha256', secret).update('stripe.refund.create').digest('hex');
    expect(() => assertApproval('stripe.refund.create', token, secret)).not.toThrow();
  });

  it('classifies refunds as high risk', () => {
    expect(TOOL_RISK['stripe.refund.create']).toBe('HIGH_RISK');
  });
});
