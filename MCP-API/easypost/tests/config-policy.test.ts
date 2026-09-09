import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';

describe('configuration and policy', () => {
  it('loads safe defaults', () => {
    const cfg = loadConfig({ EASYPOST_API_KEY: 'EZTK_test_key_12345' });
    expect(cfg.apiBase.toString()).toBe('https://api.easypost.com/v2');
    expect(cfg.requireWriteApproval).toBe(true);
    expect(cfg.destructiveEnabled).toBe(false);
  });
  it('blocks unapproved writes and destructive operations by default', () => {
    expect(() => authorize('WRITE', undefined, { requireWriteApproval: true, destructiveEnabled: false })).toThrow(/approval/i);
    expect(() => authorize('DESTRUCTIVE', true, { requireWriteApproval: true, destructiveEnabled: false })).toThrow(/disabled/i);
  });
  it('rejects non-HTTPS or unapproved API hosts', () => {
    expect(() => loadConfig({ EASYPOST_API_KEY: 'EZTK_test_key_12345', EASYPOST_API_BASE: 'http://api.easypost.com/v2' })).toThrow();
    expect(() => loadConfig({ EASYPOST_API_KEY: 'EZTK_test_key_12345', EASYPOST_API_BASE: 'https://evil.example/v2' })).toThrow();
  });
});
