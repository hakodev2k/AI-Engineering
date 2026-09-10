import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { approvalDigest, assertAllowed, TOOL_RISK } from '../src/policy.js';
import { StytchClient, StytchApiError } from '../src/client.js';
import { executeTool, toolDefinitions } from '../src/tools.js';

const baseEnv = {
  STYTCH_PROJECT_ID: 'project-test-example',
  STYTCH_SECRET: 'secret-test-example',
  STYTCH_ENVIRONMENT: 'test',
  STYTCH_TIMEOUT_MS: '1000',
  STYTCH_MAX_RETRIES: '1',
  STYTCH_REQUIRE_WRITE_APPROVAL: 'true',
  STYTCH_ENABLE_HIGH_RISK: 'false',
  STYTCH_APPROVAL_SECRET: 'approval-secret-at-least-long-enough'
};

describe('configuration', () => {
  it('requires provider credentials and fixes official environment origins', () => {
    expect(() => loadConfig({})).toThrow();
    expect(loadConfig(baseEnv).baseUrl).toBe('https://test.stytch.com');
    expect(loadConfig({ ...baseEnv, STYTCH_ENVIRONMENT: 'live' }).baseUrl).toBe('https://api.stytch.com');
  });
});

describe('tool policy', () => {
  it('registers exactly eight unique provider-scoped tools', () => {
    expect(toolDefinitions).toHaveLength(8);
    expect(new Set(toolDefinitions.map(t => t.name)).size).toBe(8);
    expect(toolDefinitions.every(t => t.name.startsWith('stytch.'))).toBe(true);
  });

  it('allows reads and denies high risk by default', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertAllowed(config, 'stytch.organization.get', {})).not.toThrow();
    expect(TOOL_RISK['stytch.member.create']).toBe('HIGH_RISK');
    expect(() => assertAllowed(config, 'stytch.member.create', {})).toThrow(/disabled/);
  });

  it('binds write approval to exact payload', () => {
    const config = loadConfig(baseEnv);
    const args = { organizationId: 'org-test', organizationName: 'New name' };
    const approvalToken = approvalDigest(config.approvalSecret!, 'stytch.organization.update', args);
    expect(() => assertAllowed(config, 'stytch.organization.update', { ...args, approvalToken })).not.toThrow();
    expect(() => assertAllowed(config, 'stytch.organization.update', { ...args, organizationName: 'Changed', approvalToken })).toThrow(/approval/);
  });
});

describe('client reliability and credential isolation', () => {
  it('sends Basic auth internally and retries a throttled read once', async () => {
    const config = loadConfig(baseEnv);
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('{"error_message":"slow down"}', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }));
    const client = new StytchClient(config, fetchMock as typeof fetch);
    await expect(client.request('GET', '/v1/b2b/organizations/org-test')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const headers = fetchMock.mock.calls[0][1].headers as Record<string,string>;
    expect(headers.Authorization).toMatch(/^Basic /);
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain(baseEnv.STYTCH_SECRET);
  });

  it('never retries mutations', async () => {
    const config = loadConfig(baseEnv);
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"error_message":"unavailable"}', { status: 503 }));
    const client = new StytchClient(config, fetchMock as typeof fetch);
    await expect(client.request('POST', '/v1/b2b/organizations', { organization_name: 'Acme' }, false)).rejects.toBeInstanceOf(StytchApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('validation and execution', () => {
  it('rejects ambiguous member lookup locally', async () => {
    const config = loadConfig(baseEnv);
    const client = { request: vi.fn() } as unknown as StytchClient;
    await expect(executeTool(config, client, 'stytch.member.get', { organizationId: 'org-test', memberId: 'm1', emailAddress: 'a@example.com' })).rejects.toThrow(/exactly one/);
  });

  it('blocks an unapproved write before any provider call', async () => {
    const config = loadConfig(baseEnv);
    const request = vi.fn();
    const client = { request } as unknown as StytchClient;
    await expect(executeTool(config, client, 'stytch.organization.create', { organizationName: 'Acme' })).rejects.toThrow(/approval/);
    expect(request).not.toHaveBeenCalled();
  });
});
