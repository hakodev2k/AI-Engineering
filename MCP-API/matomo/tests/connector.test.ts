import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadConfig, type MatomoConfig } from '../src/config.js';
import { MatomoReportingClient, READ_METHODS } from '../src/client.js';
import { MatomoMcpDiscoveryClient } from '../src/mcp.js';
import { TOOL_NAMES } from '../src/tools.js';

const originalEnv = { ...process.env };
afterEach(() => {
  process.env = { ...originalEnv };
  vi.restoreAllMocks();
});

function config(overrides: Partial<MatomoConfig> = {}): MatomoConfig {
  return {
    baseUrl: new URL('https://analytics.example.com'),
    tokenAuth: '1234567890abcdef1234567890abcdef',
    timeoutMs: 5000,
    maxRetries: 1,
    ...overrides
  };
}

describe('configuration security', () => {
  it('requires the base URL and credential', () => {
    delete process.env.MATOMO_BASE_URL;
    delete process.env.MATOMO_TOKEN_AUTH;
    expect(() => loadConfig()).toThrow('MATOMO_BASE_URL');
  });

  it('rejects insecure HTTP by default', () => {
    process.env.MATOMO_BASE_URL = 'http://analytics.example.com';
    process.env.MATOMO_TOKEN_AUTH = '1234567890abcdef1234567890abcdef';
    expect(() => loadConfig()).toThrow('HTTPS');
  });

  it('rejects a cross-origin MCP endpoint by default', () => {
    process.env.MATOMO_BASE_URL = 'https://analytics.example.com';
    process.env.MATOMO_MCP_URL = 'https://other.example.com/mcp';
    process.env.MATOMO_TOKEN_AUTH = '1234567890abcdef1234567890abcdef';
    expect(() => loadConfig()).toThrow('share the MATOMO_BASE_URL origin');
  });
});

describe('reporting client', () => {
  it('sends authentication only in a POST body and calls an allowlisted method', async () => {
    const mockFetch = vi.fn(async (_url: any, init?: RequestInit) => {
      expect(init?.method).toBe('POST');
      expect(String(init?.body)).toContain('token_auth=1234567890abcdef1234567890abcdef');
      expect(String(init?.body)).toContain('method=VisitsSummary.get');
      return new Response(JSON.stringify({ nb_visits: 12 }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new MatomoReportingClient(config(), mockFetch);
    await expect(client.call('VisitsSummary.get', { idSite: 1, period: 'day', date: 'today' })).resolves.toEqual({ nb_visits: 12 });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('denies arbitrary Matomo API methods', async () => {
    const client = new MatomoReportingClient(config(), vi.fn() as unknown as typeof fetch);
    await expect(client.call('UsersManager.addUser')).rejects.toThrow('not allowlisted');
  });

  it('retries bounded read requests after throttling', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ idsite: '1' }]), { status: 200 }));
    const client = new MatomoReportingClient(config({ maxRetries: 1 }), mockFetch as unknown as typeof fetch);
    await expect(client.call('SitesManager.getSitesWithAtLeastViewAccess')).resolves.toEqual([{ idsite: '1' }]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('maps Matomo JSON error payloads', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ result: 'error', message: 'Invalid token_auth' }), { status: 200 }));
    const client = new MatomoReportingClient(config(), mockFetch as unknown as typeof fetch);
    await expect(client.call('SitesManager.getSitesWithAtLeastViewAccess')).rejects.toThrow('Invalid token_auth');
  });
});

describe('tool and MCP boundaries', () => {
  it('registers a bounded useful tool surface', () => {
    expect(TOOL_NAMES).toHaveLength(11);
    expect(new Set(TOOL_NAMES).size).toBe(TOOL_NAMES.length);
    expect(READ_METHODS.has('SitesManager.deleteSite')).toBe(false);
  });

  it('does not execute or invent MCP tools when no official endpoint is configured', async () => {
    const discovery = new MatomoMcpDiscoveryClient(config());
    await expect(discovery.listTools()).resolves.toEqual({ configured: false, tools: [] });
  });
});
