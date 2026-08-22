import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { PagerDutyApiError, PagerDutyClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  PAGERDUTY_API_TOKEN: 'test-token',
  PAGERDUTY_FROM_EMAIL: 'bot@example.com',
  PAGERDUTY_APPROVAL_MODE: 'required',
  PAGERDUTY_APPROVED_ACTIONS: 'pagerduty.incident.acknowledge',
  PAGERDUTY_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows explicitly approved writes', () => expect(() => assertWriteAllowed(loadConfig(baseEnv), 'pagerduty.incident.acknowledge')).not.toThrow());
  it('denies unapproved writes', () => expect(() => assertWriteAllowed(loadConfig(baseEnv), 'pagerduty.incident.resolve')).toThrow(/APPROVAL_REQUIRED/));
});

describe('PagerDutyClient', () => {
  it('keeps credentials in provider headers', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Token token=test-token' });
      return new Response(JSON.stringify({ incidents: [] }), { status: 200 });
    });
    const client = new PagerDutyClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await client.request('/incidents');
  });

  it('requires From for incident mutations', async () => {
    const client = new PagerDutyClient(loadConfig({ ...baseEnv, PAGERDUTY_FROM_EMAIL: '' }), vi.fn() as unknown as typeof fetch);
    await expect(client.request('/incidents/P1', { method: 'PUT', requireFrom: true, body: {} })).rejects.toThrow(/CONFIG_ERROR/);
  });

  it('does not retry writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: { message: 'busy' } }), { status: 503 }));
    const client = new PagerDutyClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/incidents/P1', { method: 'PUT', requireFrom: true, body: {} })).rejects.toBeInstanceOf(PagerDutyApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: {} }), { status: 429, headers: { 'ratelimit-reset': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ incidents: [] }), { status: 200 }));
    const client = new PagerDutyClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await client.request('/incidents');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  it('registers scoped tools and no arbitrary request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m => m[1]);
    expect(names).toEqual(expect.arrayContaining([
      'pagerduty.incident.list','pagerduty.incident.get','pagerduty.incident.acknowledge','pagerduty.incident.resolve','pagerduty.incident.reassign',
      'pagerduty.service.list','pagerduty.service.get','pagerduty.schedule.list','pagerduty.schedule.get','pagerduty.oncall.list',
      'pagerduty.escalation_policy.list','pagerduty.user.list'
    ]));
    expect(source).not.toContain('execute_any');
  });
});
