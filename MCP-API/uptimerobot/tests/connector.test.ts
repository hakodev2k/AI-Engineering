import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { UptimeRobotApiError, UptimeRobotClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  UPTIMEROBOT_API_KEY: 'test-key',
  UPTIMEROBOT_APPROVAL_MODE: 'required',
  UPTIMEROBOT_APPROVED_ACTIONS: 'uptimerobot.monitor.create',
  UPTIMEROBOT_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows explicitly approved writes', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'uptimerobot.monitor.create')).not.toThrow();
  });
  it('denies unapproved writes', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'uptimerobot.monitor.update')).toThrow(/APPROVAL_REQUIRED/);
  });
  it('keeps destructive operations disabled by default', () => {
    const config = loadConfig({ ...baseEnv, UPTIMEROBOT_APPROVED_ACTIONS: 'uptimerobot.monitor.delete' });
    expect(() => assertWriteAllowed(config, 'uptimerobot.monitor.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('UptimeRobotClient', () => {
  it('keeps the API key in the Authorization header', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-key' });
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    });
    const client = new UptimeRobotClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/monitors')).resolves.toEqual({ data: [] });
  });

  it('does not retry authorization errors', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 }));
    const client = new UptimeRobotClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/monitors')).rejects.toBeInstanceOf(UptimeRobotApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry write failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: 'busy' }), { status: 503 }));
    const client = new UptimeRobotClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/monitors', { method: 'POST', body: {} })).rejects.toBeInstanceOf(UptimeRobotApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [{ id: 1 }] }), { status: 200 }));
    const client = new UptimeRobotClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/monitors')).resolves.toEqual({ data: [{ id: 1 }] });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  it('registers only scoped UptimeRobot tools', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'uptimerobot.monitor.list', 'uptimerobot.monitor.get', 'uptimerobot.monitor.create',
      'uptimerobot.monitor.update', 'uptimerobot.monitor.delete',
      'uptimerobot.maintenance_window.list', 'uptimerobot.maintenance_window.get',
      'uptimerobot.status_page.list', 'uptimerobot.status_page.get',
      'uptimerobot.integration.list', 'uptimerobot.integration.get'
    ]));
    expect(source).not.toContain('execute_any_api_request');
  });
});
