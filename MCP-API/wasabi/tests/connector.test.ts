import { describe, expect, it } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { assertAllowed, stripApproval, TOOL_RISK } from '../src/policy.js';

function baseEnv(extra: Record<string,string> = {}) {
  return {
    WASABI_ACCESS_KEY_ID: 'test-access',
    WASABI_SECRET_ACCESS_KEY: 'test-secret',
    WASABI_REGION: 'us-east-1',
    WASABI_ENDPOINT: 'https://s3.us-east-1.wasabisys.com',
    ...extra
  };
}

describe('Wasabi connector configuration', () => {
  it('requires credentials', () => {
    expect(() => loadConfig({})).toThrow(/required/);
  });

  it('rejects non-official endpoint hosts', () => {
    expect(() => loadConfig(baseEnv({ WASABI_ENDPOINT: 'https://evil.example/s3' }))).toThrow(/official HTTPS/);
  });

  it('defaults writes and destructive operations off', () => {
    const c = loadConfig(baseEnv());
    expect(c.allowWrite).toBe(false);
    expect(c.allowDestructive).toBe(false);
  });
});

describe('risk and approval policy', () => {
  it('classifies all 12 tools', () => {
    expect(Object.keys(TOOL_RISK)).toHaveLength(12);
    expect(TOOL_RISK['wasabi.object.delete']).toBe('DESTRUCTIVE');
    expect(TOOL_RISK['wasabi.object.presign_get']).toBe('HIGH_RISK');
  });

  it('allows reads without approval', () => {
    const c = loadConfig(baseEnv());
    expect(() => assertAllowed(c, 'wasabi.object.list', { bucket: 'abc' })).not.toThrow();
  });

  it('denies writes while disabled', () => {
    const c = loadConfig(baseEnv());
    expect(() => assertAllowed(c, 'wasabi.object.put_text', { bucket: 'abc', key: 'x', content: 'y' })).toThrow(/disabled/);
  });

  it('binds approval to exact payload', () => {
    const c = loadConfig(baseEnv({ WASABI_ALLOW_WRITE: 'true', WASABI_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef' }));
    const payload = { bucket: 'abc', key: 'x', content: 'hello' };
    const approvalToken = approvalDigest(c.approvalSecret!, 'wasabi.object.put_text', payload);
    expect(() => assertAllowed(c, 'wasabi.object.put_text', { ...payload, approvalToken })).not.toThrow();
    expect(() => assertAllowed(c, 'wasabi.object.put_text', { ...payload, content: 'changed', approvalToken })).toThrow(/approval/);
  });

  it('keeps destructive operations independently disabled', () => {
    const c = loadConfig(baseEnv({ WASABI_ALLOW_WRITE: 'true', WASABI_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef' }));
    const payload = { bucket: 'abc', key: 'x' };
    const approvalToken = approvalDigest(c.approvalSecret!, 'wasabi.object.delete', payload);
    expect(() => assertAllowed(c, 'wasabi.object.delete', { ...payload, approvalToken })).toThrow(/destructive/);
  });

  it('strips approval before provider forwarding', () => {
    expect(stripApproval({ a: 1, approvalToken: 'secret-ish' })).toEqual({ a: 1 });
  });
});
