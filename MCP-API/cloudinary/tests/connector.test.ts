import { describe, expect, it } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';

describe('config', () => {
  it('requires credentials', () => expect(() => loadConfig({})).toThrow(/Missing Cloudinary credentials/));
  it('loads bounded reliability settings', () => {
    const c = loadConfig({ CLOUDINARY_CLOUD_NAME:'demo', CLOUDINARY_API_KEY:'key', CLOUDINARY_API_SECRET:'secret', CLOUDINARY_TIMEOUT_MS:'5000', CLOUDINARY_MAX_RETRIES:'2' });
    expect(c.timeoutMs).toBe(5000); expect(c.maxRetries).toBe(2);
  });
  it('rejects unsafe retry counts', () => expect(() => loadConfig({ CLOUDINARY_CLOUD_NAME:'d', CLOUDINARY_API_KEY:'k', CLOUDINARY_API_SECRET:'s', CLOUDINARY_MAX_RETRIES:'99' })).toThrow(/MAX_RETRIES/));
});

describe('policy', () => {
  it('classifies read/write/high-risk/destructive tools', () => {
    expect(TOOL_POLICY['cloudinary.asset.get'].risk).toBe('READ');
    expect(TOOL_POLICY['cloudinary.asset.upload'].risk).toBe('WRITE');
    expect(TOOL_POLICY['cloudinary.asset.rename'].risk).toBe('HIGH_RISK');
    expect(TOOL_POLICY['cloudinary.asset.delete'].risk).toBe('DESTRUCTIVE');
  });
  it('allows reads without approval', () => expect(() => assertApproval('cloudinary.asset.get', undefined)).not.toThrow());
  it('denies writes without approval', () => expect(() => assertApproval('cloudinary.asset.upload', undefined, 'secret')).toThrow(/explicit approval/));
  it('accepts valid approval digest', () => {
    const token = approvalDigest('secret', 'cloudinary.asset.delete');
    expect(() => assertApproval('cloudinary.asset.delete', token, 'secret')).not.toThrow();
  });
  it('rejects invalid approval digest', () => expect(() => assertApproval('cloudinary.asset.delete', '0'.repeat(64), 'secret')).toThrow(/Invalid approval/));
});
