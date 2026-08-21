import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { SentryClient } from '../src/client.js';
import { requireApproval } from '../src/policy.js';
import { registerTools } from '../src/tools.js';

describe('Sentry connector', () => {
  const env = { SENTRY_AUTH_TOKEN: 'test-token', SENTRY_ORG: 'acme', SENTRY_REQUIRE_WRITE_APPROVAL: 'true', SENTRY_MAX_RETRIES: '1' };

  it('validates authentication configuration', () => {
    expect(() => loadConfig({ SENTRY_ORG: 'acme' })).toThrow(/SENTRY_AUTH_TOKEN/);
    expect(loadConfig(env).org).toBe('acme');
  });

  it('rejects unsafe non-HTTPS remote base URL', () => {
    expect(() => loadConfig({ ...env, SENTRY_BASE_URL: 'http://example.com' })).toThrow(/HTTPS/);
  });

  it('requires approval for writes', () => {
    const cfg = loadConfig(env);
    expect(() => requireApproval('sentry.issue.update', 'WRITE', false, cfg)).toThrow(/approval/);
    expect(() => requireApproval('sentry.issue.update', 'WRITE', true, cfg)).not.toThrow();
    expect(() => requireApproval('sentry.release.deploy.create', 'HIGH_RISK', false, { ...cfg, requireWriteApproval: false })).toThrow(/approval/);
  });

  it('registers the intended provider-scoped tools', () => {
    const names: string[] = [];
    const fakeServer = { registerTool: (name: string) => names.push(name) } as never;
    registerTools(fakeServer, { cfg: loadConfig(env), client: {} as SentryClient });
    expect(names).toEqual(expect.arrayContaining([
      'sentry.project.list', 'sentry.team.list', 'sentry.issue.search', 'sentry.issue.get',
      'sentry.issue.events.list', 'sentry.issue.event.get', 'sentry.issue.update', 'sentry.replay.list',
      'sentry.monitor.list', 'sentry.release.list', 'sentry.release.get', 'sentry.release.create',
      'sentry.release.deploy.create'
    ]));
    expect(names).toHaveLength(13);
  });

  it('sends bearer auth and exposes rate-limit metadata for reads', async () => {
    const headers = new Headers({ 'x-sentry-rate-limit-limit': '50', 'x-sentry-rate-limit-remaining': '49', 'link': '<next>; rel="next"' });
    const mockFetch = vi.fn(async () => new Response(JSON.stringify([{ id: '1' }]), { status: 200, headers }));
    const client = new SentryClient(loadConfig(env), mockFetch as typeof fetch);
    const result = await client.request('GET', '/organizations/acme/projects/');
    expect(mockFetch).toHaveBeenCalledOnce();
    const request = mockFetch.mock.calls[0][1];
    expect((request?.headers as Record<string, string>).Authorization).toBe('Bearer test-token');
    expect(result).toMatchObject({ rateLimit: { limit: '50', remaining: '49' }, pagination: { link: '<next>; rel="next"' } });
  });

  it('does not retry non-idempotent writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ detail: 'busy' }), { status: 503 }));
    const client = new SentryClient(loadConfig(env), mockFetch as typeof fetch);
    await expect(client.request('POST', '/organizations/acme/releases/', { body: { version: '1.0.0' }, retryable: false })).rejects.toThrow(/503/);
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('retries throttled reads within the configured bound', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ detail: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }));
    const client = new SentryClient(loadConfig(env), mockFetch as typeof fetch);
    await client.request('GET', '/organizations/acme/projects/');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
