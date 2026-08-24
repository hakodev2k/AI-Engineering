import { describe, expect, it } from 'vitest';
import { approvalDigest, assertIndexAllowed, loadConfig } from '../src/config.js';
import { assertApproval, TOOL_RISK } from '../src/policy.js';

describe('configuration and policy', () => {
  it('requires explicit authentication', () => {
    expect(() => loadConfig({ ELASTICSEARCH_URL: 'https://example.test' })).toThrow(/Configure/);
  });

  it('loads API-key authentication and bounds retries', () => {
    const cfg = loadConfig({
      ELASTICSEARCH_URL: 'https://example.test',
      ELASTICSEARCH_API_KEY: 'secret',
      ELASTIC_MAX_RETRIES: '2',
      ELASTIC_ALLOWED_INDICES: 'logs-*,products'
    });
    expect(cfg.authMode).toBe('api-key');
    expect(cfg.maxRetries).toBe(2);
    expect(() => assertIndexAllowed(cfg, 'logs-prod')).not.toThrow();
    expect(() => assertIndexAllowed(cfg, 'secrets')).toThrow(/not allowed/);
  });

  it('rejects unsafe system targets', () => {
    const cfg = loadConfig({ ELASTICSEARCH_URL: 'https://example.test', ELASTICSEARCH_API_KEY: 'secret' });
    expect(() => assertIndexAllowed(cfg, '_security')).toThrow(/Unsafe/);
    expect(() => assertIndexAllowed(cfg, '../index')).toThrow(/Unsafe/);
  });

  it('requires HMAC approval for write and destructive tools', () => {
    const secret = 'approval-secret';
    const tool = 'elasticsearch.document.update';
    expect(TOOL_RISK[tool]).toBe('WRITE');
    expect(() => assertApproval(tool, undefined, secret)).toThrow(/explicit human approval/);
    expect(() => assertApproval(tool, approvalDigest(secret, tool), secret)).not.toThrow();
  });

  it('does not require approval for read tools', () => {
    expect(() => assertApproval('elasticsearch.document.search', undefined, undefined)).not.toThrow();
  });
});
