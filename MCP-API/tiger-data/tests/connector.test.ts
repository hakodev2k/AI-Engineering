import { describe, expect, it } from 'vitest';
import { expectedApproval, loadConfig } from '../src/config.js';
import { assertReadOnlySql, byExternal, enforcePolicy, stripApproval } from '../src/policy.js';

const baseEnv = {
  TIGER_CONNECTOR_ALLOW_WRITE: 'false',
  TIGER_CONNECTOR_ALLOW_HIGH_RISK: 'false',
  TIGER_CONNECTOR_REQUIRE_WRITE_APPROVAL: 'true'
};

describe('configuration', () => {
  it('defaults to write-disabled safe mode', () => {
    const c = loadConfig(baseEnv);
    expect(c.allowWrite).toBe(false);
    expect(c.allowHighRisk).toBe(false);
  });

  it('requires public and secret client credentials together', () => {
    expect(() => loadConfig({ ...baseEnv, TIGER_PUBLIC_KEY: 'public-only' })).toThrow(/supplied together/);
  });

  it('bounds retries', () => {
    expect(() => loadConfig({ ...baseEnv, TIGER_CONNECTOR_MAX_RETRIES: '9' })).toThrow(/0-5/);
  });
});

describe('policy', () => {
  it('allows reads without approval', () => {
    const c = loadConfig(baseEnv);
    const tool = byExternal.get('tigerdata.service.list')!;
    expect(() => enforcePolicy(c, tool, {})).not.toThrow();
  });

  it('denies writes when disabled', () => {
    const c = loadConfig(baseEnv);
    const tool = byExternal.get('tigerdata.service.create')!;
    expect(() => enforcePolicy(c, tool, {})).toThrow(/disabled/);
  });

  it('binds write approval to the exact payload', () => {
    const secret = '0123456789abcdef0123456789abcdef';
    const c = loadConfig({
      ...baseEnv,
      TIGER_CONNECTOR_ALLOW_WRITE: 'true',
      TIGER_CONNECTOR_APPROVAL_SECRET: secret
    });
    const tool = byExternal.get('tigerdata.service.create')!;
    const payload = { name: 'analytics', milli_cpu: 1000 };
    const approvalToken = expectedApproval(secret, tool.external, payload);
    expect(() => enforcePolicy(c, tool, { ...payload, approvalToken })).not.toThrow();
    expect(() => enforcePolicy(c, tool, { ...payload, milli_cpu: 2000, approvalToken })).toThrow(/approval/);
  });

  it('requires a separate high-risk feature gate', () => {
    const secret = '0123456789abcdef0123456789abcdef';
    const c = loadConfig({
      ...baseEnv,
      TIGER_CONNECTOR_ALLOW_WRITE: 'true',
      TIGER_CONNECTOR_ALLOW_HIGH_RISK: 'false',
      TIGER_CONNECTOR_APPROVAL_SECRET: secret
    });
    const tool = byExternal.get('tigerdata.service.stop')!;
    const payload = { service_id: 'svc' };
    const approvalToken = expectedApproval(secret, tool.external, payload);
    expect(() => enforcePolicy(c, tool, { ...payload, approvalToken })).toThrow(/High-risk/);
  });

  it('strips approval before forwarding upstream', () => {
    expect(stripApproval({ a: 1, approvalToken: 'deadbeef' })).toEqual({ a: 1 });
  });
});

describe('SQL safety', () => {
  it('accepts read-only SQL', () => {
    expect(() => assertReadOnlySql({ query: 'SELECT time, value FROM metrics LIMIT 10' })).not.toThrow();
    expect(() => assertReadOnlySql({ sql: 'WITH x AS (SELECT 1) SELECT * FROM x' })).not.toThrow();
  });

  it('rejects mutations on the read tool', () => {
    expect(() => assertReadOnlySql({ query: 'DELETE FROM metrics WHERE id = 1' })).toThrow(/read-only/);
    expect(() => assertReadOnlySql({ query: 'WITH x AS (DELETE FROM t RETURNING *) SELECT * FROM x' })).toThrow(/read-only/);
  });
});
