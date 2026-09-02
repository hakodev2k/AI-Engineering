import { describe, expect, it } from 'vitest';
import { authorize } from '../src/policy.js';
import type { Config } from '../src/config.js';

const cfg = (approved: string[] = [], requireWriteApproval = true) => ({ apiKey: 'x', apiBaseUrl: 'https://api.workos.com', timeoutMs: 1000, maxRetries: 0, requireWriteApproval, approvedActions: new Set(approved) }) as Config;

describe('approval policy', () => {
  it('allows reads', () => expect(() => authorize(cfg(), 'READ', 'x')).not.toThrow());
  it('blocks write by default', () => expect(() => authorize(cfg(), 'WRITE', 'x')).toThrow(/approval/i));
  it('permits configured low-risk writes without approval', () => expect(() => authorize(cfg([], false), 'WRITE', 'x')).not.toThrow());
  it('always blocks unapproved high-risk access changes', () => expect(() => authorize(cfg([], false), 'HIGH_RISK', 'x')).toThrow(/approval/i));
  it('permits exact approved high-risk action', () => expect(() => authorize(cfg(['x']), 'HIGH_RISK', 'x')).not.toThrow());
});
