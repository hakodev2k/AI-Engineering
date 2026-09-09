import {afterEach, describe, expect, it} from 'vitest';
import {loadConfig} from '../src/config.js';
import {authorize, safeSegment} from '../src/policy.js';

const keys = ['CHECKLY_API_KEY','CHECKLY_ACCOUNT_ID','CHECKLY_API_BASE','CHECKLY_MCP_URL','CHECKLY_ALLOWED_API_HOSTS','CHECKLY_REQUIRE_WRITE_APPROVAL'];
afterEach(() => keys.forEach(k => delete process.env[k]));

describe('configuration and policy', () => {
  it('requires credentials and accepts the official HTTPS host', () => {
    process.env.CHECKLY_API_KEY = 'cu_test';
    process.env.CHECKLY_ACCOUNT_ID = '00000000-0000-0000-0000-000000000000';
    const cfg = loadConfig();
    expect(cfg.apiBase).toBe('https://api.checklyhq.com');
    expect(cfg.mcpUrl).toBe('https://api.checklyhq.com/mcp');
  });

  it('blocks non-allowlisted or non-HTTPS API origins', () => {
    process.env.CHECKLY_API_KEY = 'cu_test';
    process.env.CHECKLY_ACCOUNT_ID = 'account';
    process.env.CHECKLY_API_BASE = 'http://127.0.0.1:8080';
    expect(() => loadConfig()).toThrow(/HTTPS/);
  });

  it('requires explicit approval for high-risk actions', () => {
    expect(() => authorize('HIGH_RISK', false, false)).toThrow(/approval/i);
    expect(() => authorize('HIGH_RISK', true, false)).not.toThrow();
  });

  it('validates provider identifiers before path interpolation', () => {
    expect(safeSegment('abc_123-DEF','id')).toBe('abc_123-DEF');
    expect(() => safeSegment('../admin','id')).toThrow(/invalid/i);
  });
});
