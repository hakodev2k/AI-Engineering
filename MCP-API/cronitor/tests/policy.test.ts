import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { ApprovalError, DestructiveDisabledError, assertAllowed, encodePath } from '../src/policy.js';

const baseEnv = { CRONITOR_API_KEY: 'x' } as NodeJS.ProcessEnv;

describe('configuration and policy', () => {
  it('uses safe approval defaults', () => {
    const cfg = loadConfig(baseEnv);
    expect(cfg.requireWriteApproval).toBe(true);
    expect(cfg.enableDestructive).toBe(false);
  });

  it('allows READ without approval and blocks WRITE without approval', () => {
    const cfg = loadConfig(baseEnv);
    expect(() => assertAllowed(cfg, 'READ')).not.toThrow();
    expect(() => assertAllowed(cfg, 'WRITE')).toThrow(ApprovalError);
    expect(() => assertAllowed(cfg, 'WRITE', true)).not.toThrow();
  });

  it('keeps destructive operations disabled by default', () => {
    const cfg = loadConfig(baseEnv);
    expect(() => assertAllowed(cfg, 'DESTRUCTIVE', true)).toThrow(DestructiveDisabledError);
  });

  it('rejects unsafe path keys', () => {
    expect(() => encodePath('../secret')).toThrow();
    expect(encodePath('job-prod:1')).toBe('job-prod%3A1');
  });
});
