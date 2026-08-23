import { describe, expect, it, vi } from 'vitest';
import { loadConfig, assertSiteAllowed, approvalDigest } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { NetlifyClient, NetlifyApiError } from '../src/client.js';

describe('config and policy', () => {
  it('requires a token', () => expect(() => loadConfig({})).toThrow(/NETLIFY_ACCESS_TOKEN/));
  it('enforces site allowlist', () => {
    const cfg = loadConfig({ NETLIFY_ACCESS_TOKEN: 'x', NETLIFY_ALLOWED_SITE_IDS: 'a,b' });
    expect(() => assertSiteAllowed(cfg, 'a')).not.toThrow();
    expect(() => assertSiteAllowed(cfg, 'c')).toThrow(/not allowed/);
  });
  it('requires valid approval', () => {
    const secret = 'secret';
    const tool = 'netlify.deploy.restore';
    expect(() => assertApproval(tool, approvalDigest(secret, tool), secret)).not.toThrow();
    expect(() => assertApproval(tool, '0'.repeat(64), secret)).toThrow(/Invalid approval/);
  });
});

describe('client', () => {
  const cfg = loadConfig({ NETLIFY_ACCESS_TOKEN: 'token', NETLIFY_MAX_RETRIES: '0' });

  it('sends bearer credentials without exposing them in the URL', async () => {
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(String(_url)).not.toContain('token');
      expect((init?.headers as Record<string,string>).Authorization).toBe('Bearer token');
      return new Response(JSON.stringify([{ id: 'site' }]), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new NetlifyClient(cfg, fetchMock as typeof fetch);
    expect(await client.get('/sites')).toEqual([{ id: 'site' }]);
  });

  it('maps provider errors', async () => {
    const fetchMock = vi.fn(async () => new Response('forbidden', { status: 403 }));
    const client = new NetlifyClient(cfg, fetchMock as typeof fetch);
    await expect(client.get('/sites')).rejects.toBeInstanceOf(NetlifyApiError);
  });

  it('preserves rate-limit retry-after', async () => {
    const fetchMock = vi.fn(async () => new Response('limited', { status: 429, headers: { 'retry-after': '9' } }));
    const client = new NetlifyClient(cfg, fetchMock as typeof fetch);
    await expect(client.get('/sites')).rejects.toMatchObject({ status: 429, retryAfter: 9 });
  });
});
