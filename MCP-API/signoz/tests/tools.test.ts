import { describe, expect, it } from 'vitest';
import { enforcePolicy, POLICIES } from '../src/tools.js';
import type { Config } from '../src/config.js';
import { TOOL_MAP } from '../src/upstream.js';

const base: Config = {
  mcpUrl: 'https://mcp.us.signoz.cloud/mcp',
  signozUrl: 'https://example.signoz.cloud',
  apiKey: 'test-only',
  timeoutMs: 15000,
  allowWrite: false,
  allowDestructive: false
};

describe('SigNoz connector policies', () => {
  it('registers a policy for every exposed tool', () => {
    expect(Object.keys(POLICIES).sort()).toEqual(Object.keys(TOOL_MAP).sort());
  });

  it('allows read operations without approval', () => {
    expect(() => enforcePolicy('signoz.metric.query', base)).not.toThrow();
  });

  it('denies writes by default', () => {
    expect(() => enforcePolicy('signoz.alert.create', base, true)).toThrow(/write enablement/);
  });

  it('requires explicit approval for enabled writes', () => {
    const cfg = { ...base, allowWrite: true };
    expect(() => enforcePolicy('signoz.alert.create', cfg, false)).toThrow(/explicit approval/);
    expect(() => enforcePolicy('signoz.alert.create', cfg, true)).not.toThrow();
  });

  it('keeps destructive delete disabled unless separately enabled and approved', () => {
    const cfg = { ...base, allowWrite: true, allowDestructive: true };
    expect(() => enforcePolicy('signoz.alert.delete', cfg, false)).toThrow(/destructive/);
    expect(() => enforcePolicy('signoz.alert.delete', cfg, true)).not.toThrow();
  });
});
