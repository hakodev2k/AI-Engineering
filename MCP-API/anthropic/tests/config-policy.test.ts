import { describe, expect, it } from 'vitest';
import { approvalDigest, assertModelAllowed, loadConfig } from '../src/config.js';
import { assertApproval, toolRisk } from '../src/policy.js';

describe('configuration and policy', () => {
  it('requires an API key', () => {
    expect(() => loadConfig({})).toThrow('ANTHROPIC_API_KEY is required');
  });

  it('loads safe defaults and model allowlist', () => {
    const config = loadConfig({ ANTHROPIC_API_KEY: 'test', ANTHROPIC_ALLOWED_MODELS: 'model-a,model-b' });
    expect(config.version).toBe('2023-06-01');
    expect(config.baseUrl).toBe('https://api.anthropic.com');
    expect(() => assertModelAllowed(config, 'model-a')).not.toThrow();
    expect(() => assertModelAllowed(config, 'model-x')).toThrow('Model not allowed');
  });

  it('rejects unsafe base URLs', () => {
    expect(() => loadConfig({ ANTHROPIC_API_KEY: 'test', ANTHROPIC_BASE_URL: 'http://example.com' })).toThrow();
    expect(() => loadConfig({ ANTHROPIC_API_KEY: 'test', ANTHROPIC_BASE_URL: 'https://user:pass@example.com' })).toThrow();
  });

  it('requires approval for write and high-risk tools', () => {
    const secret = 'approval-secret';
    expect(toolRisk['anthropic.message.create']).toBe('WRITE');
    expect(() => assertApproval('anthropic.message.create', undefined, secret)).toThrow('Explicit approval required');
    const token = approvalDigest(secret, 'anthropic.message.create');
    expect(() => assertApproval('anthropic.message.create', token, secret)).not.toThrow();
    expect(() => assertApproval('anthropic.batch.cancel', approvalDigest(secret, 'anthropic.batch.cancel'), secret)).not.toThrow();
  });

  it('allows read tools without approval', () => {
    expect(() => assertApproval('anthropic.model.list', undefined, undefined)).not.toThrow();
  });
});
