import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { assertAllowed, loadConfig } from '../src/config.js';
import { TOOL_ALIASES } from '../src/upstream.js';

const baseEnv = {
  SALESFORCE_MCP_ACCESS_TOKEN: 'test-token',
  SALESFORCE_ENVIRONMENT: 'production',
  SALESFORCE_APPROVAL_MODE: 'required',
  SALESFORCE_APPROVED_ACTIONS: 'salesforce.record.create',
  SALESFORCE_ALLOW_DESTRUCTIVE: 'false',
  SALESFORCE_TIMEOUT_MS: '20000'
};

describe('configuration', () => {
  it('requires an access token', () => expect(() => loadConfig({})).toThrow());
  it('uses official production read server', () => expect(loadConfig(baseEnv).readUrl).toBe('https://api.salesforce.com/platform/mcp/v1/platform/sobject-reads'));
  it('uses official sandbox server family when selected', () => expect(loadConfig({ ...baseEnv, SALESFORCE_ENVIRONMENT: 'sandbox' }).mutationUrl).toContain('/sandbox/platform/sobject-mutations'));
});

describe('approval policy', () => {
  it('allows explicitly approved writes', () => expect(() => assertAllowed(loadConfig(baseEnv), 'salesforce.record.create')).not.toThrow());
  it('denies unapproved writes', () => expect(() => assertAllowed(loadConfig(baseEnv), 'salesforce.record.update')).toThrow(/APPROVAL_REQUIRED/));
  it('keeps destructive tools disabled independently of approval', () => {
    const cfg = loadConfig({ ...baseEnv, SALESFORCE_APPROVED_ACTIONS: 'salesforce.record.delete' });
    expect(() => assertAllowed(cfg, 'salesforce.record.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('upstream allowlist', () => {
  it('contains only named Salesforce tool aliases', () => {
    const aliases = Object.values(TOOL_ALIASES).flat();
    expect(aliases.length).toBeGreaterThanOrEqual(11);
    expect(aliases.some(x => /execute|dispatch|raw/i.test(x))).toBe(false);
  });
});

describe('tool surface', () => {
  it('registers stable scoped tools with no generic request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m => m[1]);
    expect(names).toEqual(expect.arrayContaining([
      'salesforce.schema.get', 'salesforce.record.query', 'salesforce.record.search', 'salesforce.user.get',
      'salesforce.record.recent', 'salesforce.record.related.list', 'salesforce.record.create',
      'salesforce.record.update', 'salesforce.record.related.update', 'salesforce.record.delete',
      'salesforce.record.related.delete'
    ]));
    expect(source).not.toMatch(/execute_any|raw_request|dispatch_any/);
  });

  it('requires WHERE and LIMIT for SOQL reads', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    expect(source).toContain('SOQL must include WHERE and LIMIT');
  });
});
