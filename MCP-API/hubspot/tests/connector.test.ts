import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { HubSpotCredentialProvider } from '../src/auth.js';
import { HubSpotClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseConfig = loadConfig({ HUBSPOT_ACCESS_TOKEN: 'test-token' } as NodeJS.ProcessEnv);

function response(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });
}

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => {
    expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/CONFIG_ERROR/);
  });

  it('defaults writes off and approval on', () => {
    expect(baseConfig.allowWrites).toBe(false);
    expect(baseConfig.requireApproval).toBe(true);
  });

  it('requires both write enablement and explicit approval', () => {
    expect(() => assertWriteAllowed(baseConfig, 'hubspot.contact.create', 'APPROVE')).toThrow(/PERMISSION_DENIED/);
    const enabled = loadConfig({ HUBSPOT_ACCESS_TOKEN: 'x', HUBSPOT_ALLOW_WRITES: 'true' } as NodeJS.ProcessEnv);
    expect(() => assertWriteAllowed(enabled, 'hubspot.contact.create')).toThrow(/APPROVAL_REQUIRED/);
    expect(() => assertWriteAllowed(enabled, 'hubspot.contact.create', 'APPROVE')).not.toThrow();
  });
});

describe('credential isolation', () => {
  it('refreshes OAuth credentials through the v3 token endpoint', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => response(200, { access_token: 'refreshed', expires_in: 1800 }));
    const config = loadConfig({
      HUBSPOT_CLIENT_ID: 'client', HUBSPOT_CLIENT_SECRET: 'secret', HUBSPOT_REFRESH_TOKEN: 'refresh'
    } as NodeJS.ProcessEnv);
    const provider = new HubSpotCredentialProvider(config, fetchMock as typeof fetch);
    await expect(provider.getToken()).resolves.toBe('refreshed');
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe('https://api.hubapi.com/oauth/v3/token');
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(String(init.body)).toContain('grant_type=refresh_token');
  });
});

describe('HubSpot client reliability', () => {
  it('performs a bounded authenticated read', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-token');
      return response(200, { results: [{ id: '1' }] });
    });
    const client = new HubSpotClient(baseConfig, fetchMock as typeof fetch);
    await expect(client.request('/crm/v3/owners/')).resolves.toEqual({ results: [{ id: '1' }] });
  });

  it('honors retry-after for retryable throttled reads', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => response(200, { ok: true }))
      .mockResolvedValueOnce(response(429, { message: 'slow down' }, { 'retry-after': '0' }));
    const client = new HubSpotClient(baseConfig, fetchMock as typeof fetch);
    await expect(client.request('/crm/v3/owners/')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry non-idempotent writes', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => response(500, { message: 'temporary failure' }));
    const client = new HubSpotClient(baseConfig, fetchMock as typeof fetch);
    await expect(client.request('/crm/v3/objects/contacts', { method: 'POST', body: { properties: { email: 'a@b.test' } } }))
      .rejects.toThrow(/UPSTREAM_ERROR/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('maps provider permission failures', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => response(403, { message: 'missing scope' }));
    const client = new HubSpotClient(baseConfig, fetchMock as typeof fetch);
    await expect(client.request('/crm/v3/owners/')).rejects.toThrow(/PERMISSION_DENIED/);
  });

  it('blocks arbitrary absolute URL passthrough', async () => {
    const client = new HubSpotClient(baseConfig, vi.fn() as unknown as typeof fetch);
    await expect(client.request('https://evil.example/')).rejects.toThrow(/VALIDATION_ERROR/);
  });
});

describe('MCP tool registration source', () => {
  it('registers the documented provider-scoped tool surface', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const expected = [
      'hubspot.owner.list',
      'hubspot.contact.search', 'hubspot.contact.get', 'hubspot.contact.create', 'hubspot.contact.update',
      'hubspot.company.search', 'hubspot.company.get', 'hubspot.company.create', 'hubspot.company.update',
      'hubspot.deal.search', 'hubspot.deal.get', 'hubspot.deal.create', 'hubspot.deal.update'
    ];
    for (const tool of expected) expect(source).toContain(`'${tool}'`);
  });
});
