import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';
import { KeapApiError, KeapClient } from '../src/client.js';

const baseEnv = {
  KEAP_ACCESS_TOKEN: 'test-token',
  KEAP_API_BASE: 'https://api.infusionsoft.com/crm/rest/v1',
  KEAP_TOKEN_URL: 'https://api.infusionsoft.com/token',
  KEAP_REQUEST_TIMEOUT_MS: '2000',
  KEAP_MAX_RETRIES: '1',
  KEAP_REQUIRE_WRITE_APPROVAL: 'true',
  KEAP_DESTRUCTIVE_ENABLED: 'false'
};

describe('config', () => {
  it('loads safe official hosts', () => {
    const c = loadConfig(baseEnv);
    expect(c.apiBase).toBe('https://api.infusionsoft.com/crm/rest/v1');
    expect(c.requireWriteApproval).toBe(true);
  });

  it('rejects arbitrary API hosts to prevent SSRF/token exfiltration', () => {
    expect(() => loadConfig({ ...baseEnv, KEAP_API_BASE: 'https://evil.example/crm/rest/v1' })).toThrow(/api\.infusionsoft\.com/);
  });
});

describe('policy', () => {
  it('allows reads without approval', () => expect(() => authorize('READ', undefined, { requireWriteApproval: true, destructiveEnabled: false })).not.toThrow());
  it('blocks writes without approval by default', () => expect(() => authorize('WRITE', false, { requireWriteApproval: true, destructiveEnabled: false })).toThrow(/approval/i));
  it('blocks destructive operations while disabled even if approved', () => expect(() => authorize('DESTRUCTIVE', true, { requireWriteApproval: true, destructiveEnabled: false })).toThrow(/disabled/i));
});

describe('client', () => {
  it('adds bearer auth and parses successful JSON', async () => {
    const fetchMock = vi.fn(async (_url: any, init: any) => new Response(JSON.stringify({ contacts: [] }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new KeapClient(loadConfig(baseEnv), fetchMock as any);
    const value = await client.request('GET', '/contacts', undefined, { limit: 10, offset: 0 });
    expect(value).toEqual({ contacts: [] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer test-token');
    expect(String(fetchMock.mock.calls[0][0])).toContain('limit=10');
  });

  it('retries a throttled read and succeeds', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ tags: [] }), { status: 200 }));
    const client = new KeapClient(loadConfig(baseEnv), fetchMock as any);
    await expect(client.request('GET', '/tags')).resolves.toEqual({ tags: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not turn a 403 into a retry loop', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ message: 'forbidden' }), { status: 403 }));
    const client = new KeapClient(loadConfig(baseEnv), fetchMock as any);
    await expect(client.request('GET', '/contacts')).rejects.toBeInstanceOf(KeapApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('refreshes once after 401 when OAuth refresh credentials are configured', async () => {
    const env = { ...baseEnv, KEAP_CLIENT_ID: 'cid', KEAP_CLIENT_SECRET: 'secret', KEAP_REFRESH_TOKEN: 'refresh' };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'expired' }), { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'new-token', refresh_token: 'new-refresh' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ contacts: [{ id: 1 }] }), { status: 200 }));
    const client = new KeapClient(loadConfig(env), fetchMock as any);
    await expect(client.request('GET', '/contacts')).resolves.toEqual({ contacts: [{ id: 1 }] });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe('Bearer new-token');
  });
});
