import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { Auth0Client, Auth0Error } from '../src/client.js';

describe('configuration and policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({ AUTH0_DOMAIN: 'tenant.auth0.com' })).toThrow());
  it('loads static token config', () => expect(loadConfig({ AUTH0_DOMAIN: 'tenant.auth0.com', AUTH0_MANAGEMENT_TOKEN: 'x' }).domain).toBe('tenant.auth0.com'));
  it('registers destructive user deletion policy', () => expect(TOOL_POLICY['auth0.user.delete']).toEqual({ risk: 'DESTRUCTIVE', approval: true }));
  it('requires payload-bound approval', () => {
    const secret = 'secret'; const payload = { userId: 'auth0|123' };
    const id = approvalDigest(secret, 'auth0.user.delete', payload);
    expect(() => assertApproval('auth0.user.delete', payload, id, secret)).not.toThrow();
    expect(() => assertApproval('auth0.user.delete', { userId: 'auth0|456' }, id, secret)).toThrow();
  });
});

describe('Auth0Client', () => {
  const cfg = loadConfig({ AUTH0_DOMAIN: 'tenant.auth0.com', AUTH0_MANAGEMENT_TOKEN: 'token', AUTH0_MAX_RETRIES: '1', AUTH0_TIMEOUT_MS: '1000' });
  it('performs read request with bearer token', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify([{ user_id: 'auth0|1' }]), { status: 200, headers: { 'content-type': 'application/json' } }));
    const c = new Auth0Client(cfg, fetcher as any);
    expect(await c.request('GET', '/api/v2/users?page=0')).toEqual([{ user_id: 'auth0|1' }]);
    expect((fetcher.mock.calls[0][1] as any).headers.authorization).toBe('Bearer token');
  });
  it('does not allow arbitrary upstream paths', async () => {
    const c = new Auth0Client(cfg, vi.fn() as any);
    await expect(c.request('GET', 'https://evil.example/')).rejects.toThrow('Only Auth0 Management API v2 paths are allowed');
  });
  it('does not blindly retry writes', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ message: 'busy' }), { status: 500 }));
    const c = new Auth0Client(cfg, fetcher as any);
    await expect(c.request('POST', '/api/v2/users', {})).rejects.toBeInstanceOf(Auth0Error);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('retries a throttled GET with bounded attempts', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(new Response('{}', { status: 429, headers: { 'retry-after': '0' } })).mockResolvedValueOnce(new Response('[]', { status: 200 }));
    const c = new Auth0Client(cfg, fetcher as any);
    expect(await c.request('GET', '/api/v2/users')).toEqual([]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
