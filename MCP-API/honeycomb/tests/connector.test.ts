import { describe, expect, it } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { POLICY, assertApproval, validatePayload } from '../src/policy.js';

describe('Honeycomb connector security and validation', () => {
  const env = {
    HONEYCOMB_MCP_URL: 'https://mcp.honeycomb.io/mcp',
    HONEYCOMB_MCP_API_KEY: 'hcxmk_example:secret',
    HONEYCOMB_APPROVAL_SECRET: 'approval-secret',
    HONEYCOMB_TIMEOUT_MS: '5000',
    HONEYCOMB_MAX_RETRIES: '2',
    HONEYCOMB_MAX_PAYLOAD_BYTES: '4096'
  } as NodeJS.ProcessEnv;

  it('loads only official Honeycomb MCP hosts', () => {
    expect(loadConfig(env).mcpUrl).toBe('https://mcp.honeycomb.io/mcp');
    expect(() => loadConfig({ ...env, HONEYCOMB_MCP_URL: 'https://evil.example/mcp' })).toThrow(/official Honeycomb/);
    expect(() => loadConfig({ ...env, HONEYCOMB_MCP_URL: 'http://mcp.honeycomb.io/mcp' })).toThrow(/https/);
  });

  it('requires key id and secret format', () => {
    expect(() => loadConfig({ ...env, HONEYCOMB_MCP_API_KEY: 'not-a-pair' })).toThrow(/key-id/);
  });

  it('registers ten allowlisted capabilities with fixed upstream names', () => {
    expect(Object.keys(POLICY)).toHaveLength(10);
    expect(POLICY['honeycomb.query.run'].upstream).toBe('run_query');
    expect(POLICY['honeycomb.trigger.create'].risk).toBe('HIGH_RISK');
  });

  it('blocks credential-like agent parameters', () => {
    expect(() => validatePayload({ api_key: 'leak' }, { maxPayloadBytes: 4096 })).toThrow(/credential-like/);
  });

  it('enforces payload size', () => {
    expect(() => validatePayload({ value: 'x'.repeat(5000) }, { maxPayloadBytes: 1024 })).toThrow(/size limit/);
  });

  it('allows read operations without approval', () => {
    expect(() => assertApproval('honeycomb.query.run', { query: 'x' }, undefined, undefined)).not.toThrow();
  });

  it('requires payload-bound approval for writes', () => {
    const payload = { name: 'Agent board' };
    expect(() => assertApproval('honeycomb.board.create', payload, undefined, 'approval-secret')).toThrow(/explicit approval/);
    const token = approvalDigest('approval-secret', 'honeycomb.board.create', payload);
    expect(() => assertApproval('honeycomb.board.create', payload, token, 'approval-secret')).not.toThrow();
    expect(() => assertApproval('honeycomb.board.create', { name: 'Changed' }, token, 'approval-secret')).toThrow(/invalid approval/);
  });

  it('does not retry writes by policy', () => {
    expect(POLICY['honeycomb.board.create'].risk).not.toBe('READ');
    expect(POLICY['honeycomb.trigger.create'].approval).toBe(true);
    expect(POLICY['honeycomb.slo.update'].approval).toBe(true);
  });
});
