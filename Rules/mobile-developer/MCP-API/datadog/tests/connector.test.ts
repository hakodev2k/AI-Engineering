import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { DatadogApiError, DatadogClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  DATADOG_API_KEY: 'api-test-key',
  DATADOG_APPLICATION_KEY: 'app-test-key',
  DATADOG_APPROVAL_MODE: 'required',
  DATADOG_APPROVED_ACTIONS: 'datadog.monitor.create',
  DATADOG_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows an explicitly approved write', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'datadog.monitor.create')).not.toThrow();
  });
  it('denies an unapproved write', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'datadog.monitor.update')).toThrow(/APPROVAL_REQUIRED/);
  });
  it('keeps destructive operations disabled by default', () => {
    const config = loadConfig({ ...baseEnv, DATADOG_APPROVED_ACTIONS: 'datadog.monitor.delete' });
    expect(() => assertWriteAllowed(config, 'datadog.monitor.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('DatadogClient', () => {
  it('keeps both credentials in provider headers', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({
        'DD-API-KEY': 'api-test-key',
        'DD-APPLICATION-KEY': 'app-test-key'
      });
      return new Response(JSON.stringify({ valid: true }), { status: 200 });
    });
    const client = new DatadogClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/v1/validate')).resolves.toEqual({ valid: true });
  });

  it('maps provider authorization errors and does not retry them', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: ['Forbidden'] }), { status: 403 }));
    const client = new DatadogClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/v1/monitor')).rejects.toBeInstanceOf(DatadogApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: ['Busy'] }), { status: 503 }));
    const client = new DatadogClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/v1/monitor', { method: 'POST', body: {} })).rejects.toBeInstanceOf(DatadogApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ errors: ['rate limited'] }), { status: 429, headers: { 'x-ratelimit-reset': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 1 }]), { status: 200 }));
    const client = new DatadogClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    const result = await client.request<unknown[]>('/api/v1/monitor');
    expect(result).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  it('registers the intended scoped tools and no generic request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'datadog.auth.validate', 'datadog.monitor.list', 'datadog.monitor.get',
      'datadog.monitor.create', 'datadog.monitor.update', 'datadog.monitor.delete',
      'datadog.dashboard.list', 'datadog.dashboard.get', 'datadog.incident.list',
      'datadog.incident.get', 'datadog.metric.query', 'datadog.event.list'
    ]));
    expect(source).not.toContain('execute_any');
  });
});
