import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertAllowed } from '../src/policy.js';
import { ClerkApiError, ClerkClient } from '../src/client.js';

const base = { CLERK_SECRET_KEY:'sk_test_fake', CLERK_APPROVAL_SECRET:'approval-secret', CLERK_REQUIRE_WRITE_APPROVAL:'true', CLERK_ALLOW_DESTRUCTIVE:'false' } as NodeJS.ProcessEnv;

describe('configuration and policy', () => {
  it('requires credentials', () => expect(() => loadConfig({})).toThrow(/CLERK_SECRET_KEY/));
  it('rejects insecure base URL', () => expect(() => loadConfig({...base,CLERK_API_BASE_URL:'http://example.com'})).toThrow(/HTTPS/));
  it('allows reads without approval', () => expect(() => assertAllowed(loadConfig(base),'clerk.user.get')).not.toThrow());
  it('denies writes without approval', () => expect(() => assertAllowed(loadConfig(base),'clerk.user.create')).toThrow(/explicit approval/));
  it('accepts valid write approval', () => { const c=loadConfig(base); expect(() => assertAllowed(c,'clerk.user.create',approvalDigest('approval-secret','clerk.user.create'))).not.toThrow(); });
  it('disables destructive operations by default', () => expect(() => assertAllowed(loadConfig(base),'clerk.user.delete','x')).toThrow(/disabled/));
});

describe('client', () => {
  it('isolates secret in Authorization header and parses JSON', async () => {
    const f = vi.fn(async (_u:any, init:any) => { expect(init.headers.Authorization).toBe('Bearer sk_test_fake'); return new Response(JSON.stringify({id:'user_1'}),{status:200,headers:{'content-type':'application/json'}}); });
    const c = new ClerkClient(loadConfig(base), f as any);
    await expect(c.request('GET','/users/user_1')).resolves.toEqual({id:'user_1'});
  });
  it('maps provider errors and preserves Retry-After', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({errors:[{message:'rate limited'}]}),{status:429,headers:{'retry-after':'7'}}));
    const c = new ClerkClient(loadConfig(base), f as any);
    try { await c.request('POST','/users',{}); throw new Error('expected failure'); } catch (e) { expect(e).toBeInstanceOf(ClerkApiError); expect((e as ClerkApiError).retryAfter).toBe(7); }
  });
  it('does not retry writes', async () => {
    const f = vi.fn(async () => new Response('{}',{status:500}));
    const c = new ClerkClient(loadConfig(base), f as any);
    await expect(c.request('POST','/users',{})).rejects.toBeInstanceOf(ClerkApiError);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('retries transient GET failures with a bound', async () => {
    let n=0; const f=vi.fn(async()=>{ n++; return n<2?new Response('{}',{status:500}):new Response('{"ok":true}',{status:200}); });
    const c=new ClerkClient(loadConfig(base),f as any); await expect(c.request('GET','/users')).resolves.toEqual({ok:true}); expect(f).toHaveBeenCalledTimes(2);
  });
});
