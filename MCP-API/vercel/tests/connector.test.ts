import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, assertProjectAllowed, loadConfig } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { VercelClient, VercelApiError } from '../src/client.js';

const baseEnv = { VERCEL_ACCESS_TOKEN: 'test-token', VERCEL_MCP_ENABLED: 'false' };

describe('configuration', () => {
  it('requires token', () => expect(() => loadConfig({})).toThrow(/VERCEL_ACCESS_TOKEN/));
  it('enforces allowlist', () => {
    const c = loadConfig({ ...baseEnv, VERCEL_ALLOWED_PROJECTS: 'alpha,beta' });
    expect(() => assertProjectAllowed(c, 'alpha')).not.toThrow();
    expect(() => assertProjectAllowed(c, 'gamma')).toThrow(/not allowed/);
  });
});

describe('approval', () => {
  it('accepts only matching digest', () => {
    const secret = 'x'.repeat(32); const token = approvalDigest(secret, 'vercel.domain.remove');
    expect(() => assertApproval('vercel.domain.remove', token, secret)).not.toThrow();
    expect(() => assertApproval('vercel.domain.remove', '0'.repeat(64), secret)).toThrow(/denied/);
  });
});

describe('REST client', () => {
  it('adds bearer auth and team scope', async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => new Response(JSON.stringify({ ok: true, url: String(input), auth: new Headers(init?.headers).get('Authorization') }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const c = new VercelClient(loadConfig({ ...baseEnv, VERCEL_TEAM_ID: 'team_123' }), fetcher as typeof fetch);
    const r = await c.get<{url:string;auth:string}>('/v9/projects');
    expect(r.url).toContain('teamId=team_123'); expect(r.auth).toBe('Bearer test-token');
  });
  it('does not blindly retry writes', async () => {
    const fetcher = vi.fn(async () => new Response('busy', { status: 500 }));
    const c = new VercelClient(loadConfig(baseEnv), fetcher as typeof fetch);
    await expect(c.post('/v13/deployments', {})).rejects.toBeInstanceOf(VercelApiError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('maps provider errors', async () => {
    const fetcher = vi.fn(async () => new Response('{"error":{"code":"forbidden"}}', { status: 403 }));
    const c = new VercelClient(loadConfig(baseEnv), fetcher as typeof fetch);
    await expect(c.get('/v9/projects')).rejects.toMatchObject({ status: 403 });
  });
});
