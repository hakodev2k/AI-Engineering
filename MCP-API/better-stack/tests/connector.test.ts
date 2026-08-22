import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { BetterStackApiError, BetterStackClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  BETTERSTACK_API_TOKEN: 'test-token',
  BETTERSTACK_USE_MCP: 'false',
  BETTERSTACK_APPROVAL_MODE: 'required',
  BETTERSTACK_APPROVED_ACTIONS: 'betterstack.monitor.create',
  BETTERSTACK_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows explicitly approved writes', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'betterstack.monitor.create')).not.toThrow();
  });
  it('denies unapproved writes', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'betterstack.heartbeat.create')).toThrow(/APPROVAL_REQUIRED/);
  });
  it('keeps destructive operations disabled by default', () => {
    const config = loadConfig({ ...baseEnv, BETTERSTACK_APPROVED_ACTIONS: 'betterstack.test.delete' });
    expect(() => assertWriteAllowed(config, 'betterstack.test.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('BetterStackClient', () => {
  it('keeps credentials in the Authorization header', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-token' });
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    });
    const client = new BetterStackClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/v2/monitors')).resolves.toEqual({ data: [] });
  });

  it('does not retry authorization errors', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: 'Forbidden' }), { status: 403 }));
    const client = new BetterStackClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/v2/monitors')).rejects.toBeInstanceOf(BetterStackApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: 'Busy' }), { status: 503 }));
    const client = new BetterStackClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/v2/monitors', { method: 'POST', body: {} })).rejects.toBeInstanceOf(BetterStackApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries throttled reads only within the bounded policy', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ errors: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [{ id: '1' }] }), { status: 200 }));
    const client = new BetterStackClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    const result = await client.request<{ data: unknown[] }>('/api/v2/monitors');
    expect(result.data).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool and upstream MCP surface', () => {
  it('registers scoped tools without a generic HTTP escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'betterstack.monitor.list', 'betterstack.monitor.get', 'betterstack.monitor.create',
      'betterstack.heartbeat.list', 'betterstack.heartbeat.get', 'betterstack.heartbeat.create',
      'betterstack.incident.list', 'betterstack.incident.get', 'betterstack.on_call.list',
      'betterstack.on_call.events', 'betterstack.status_page.list', 'betterstack.status_page.get'
    ]));
    expect(source).not.toContain('execute_any_api_request');
  });

  it('allowlists only reviewed upstream MCP tools', () => {
    const source = readFileSync(new URL('../src/upstream-mcp.ts', import.meta.url), 'utf8');
    expect(source).toContain("new Set(['monitors', 'monitor', 'incidents'])");
    expect(source).toContain('X-MCP-Tools-Only');
  });
});
