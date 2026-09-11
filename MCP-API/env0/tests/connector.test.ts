import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { requireApproval } from '../src/policy.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';

describe('env0 connector configuration', () => {
  it('requires API credentials and applies safe defaults', () => {
    const config = loadConfig({ ENV0_API_KEY:'key', ENV0_API_SECRET:'secret' });
    expect(config.image).toBe('env0/mcp-server');
    expect(config.requireWriteApproval).toBe(true);
    expect(config.enableDestructive).toBe(false);
    expect(config.timeoutMs).toBe(30000);
  });
  it('rejects missing credentials and invalid timeout', () => {
    expect(() => loadConfig({})).toThrow(/required/);
    expect(() => loadConfig({ ENV0_API_KEY:'k', ENV0_API_SECRET:'s', ENV0_TIMEOUT_MS:'0' })).toThrow(/1000/);
  });
});

describe('approval policy', () => {
  const config = loadConfig({ ENV0_API_KEY:'k', ENV0_API_SECRET:'s' });
  it('allows reads without approval', () => expect(() => requireApproval(config, 'READ', undefined)).not.toThrow());
  it('blocks writes and high-risk actions without approval', () => {
    expect(() => requireApproval(config, 'WRITE', undefined)).toThrow(/approval/i);
    expect(() => requireApproval(config, 'HIGH_RISK', false)).toThrow(/approval/i);
    expect(() => requireApproval(config, 'HIGH_RISK', true)).not.toThrow();
  });
  it('blocks destructive actions by default even when approved', () => expect(() => requireApproval(config, 'DESTRUCTIVE', true)).toThrow(/disabled/i));
});

describe('official upstream allowlist', () => {
  it('contains the selected workflow tools and rejects arbitrary names', () => {
    expect(ALLOWED_UPSTREAM_TOOLS.has('get-projects')).toBe(true);
    expect(ALLOWED_UPSTREAM_TOOLS.has('deploy-environment')).toBe(true);
    expect(ALLOWED_UPSTREAM_TOOLS.has('generate-iac')).toBe(true);
    expect(ALLOWED_UPSTREAM_TOOLS.has('execute-anything')).toBe(false);
    expect(ALLOWED_UPSTREAM_TOOLS.size).toBe(14);
  });
});
