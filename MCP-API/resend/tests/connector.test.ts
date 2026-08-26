import { describe, expect, it } from 'vitest';
import { approvalToken, loadConfig } from '../src/config.js';
import { assertApproved, TOOL_POLICY } from '../src/policy.js';

describe('configuration', () => {
  it('requires credentials', () => expect(() => loadConfig({})).toThrow(/RESEND_API_KEY/));
  it('rejects non-HTTPS upstreams', () => expect(() => loadConfig({ RESEND_API_KEY: 're_test', RESEND_UPSTREAM_MCP_URL: 'http://example.test/mcp' })).toThrow(/HTTPS/));
  it('bounds retry configuration', () => expect(() => loadConfig({ RESEND_API_KEY: 're_test', RESEND_MAX_RETRIES: '99' })).toThrow(/MAX_RETRIES/));
});

describe('permission and approval policy', () => {
  const config = loadConfig({ RESEND_API_KEY: 're_test', RESEND_APPROVAL_SECRET: 'unit-test-secret', RESEND_REQUIRE_WRITE_APPROVAL: 'true' });

  it('allowlists meaningful tools', () => {
    expect(Object.keys(TOOL_POLICY)).toHaveLength(13);
    expect(TOOL_POLICY['resend.email.send'].risk).toBe('HIGH_RISK');
    expect(TOOL_POLICY['resend.contact.delete'].risk).toBe('DESTRUCTIVE');
    expect(TOOL_POLICY['resend.email.list'].risk).toBe('READ');
  });

  it('allows read operations without approval', () => {
    expect(() => assertApproved(config, 'resend.email.list', {})).not.toThrow();
  });

  it('denies unapproved external sends', () => {
    expect(() => assertApproved(config, 'resend.email.send', { to: ['a@example.com'] })).toThrow(/approval/);
  });

  it('accepts approval only for the exact tool payload', () => {
    const payload = { to: ['a@example.com'], subject: 'test', text: 'body' };
    const token = approvalToken('unit-test-secret', 'resend.email.send', payload);
    expect(() => assertApproved(config, 'resend.email.send', { ...payload, approvalToken: token }, token)).not.toThrow();
    expect(() => assertApproved(config, 'resend.email.send', { ...payload, subject: 'changed', approvalToken: token }, token)).toThrow(/Invalid/);
  });

  it('denies unknown tools', () => {
    expect(() => assertApproved(config, 'resend.execute_anything', {})).toThrow(/allowlisted/);
  });
});
