import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { SupabaseApiError, SupabaseClient } from '../src/client.js';
import { assertActionAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  SUPABASE_ACCESS_TOKEN: 'sbp_test_token',
  SUPABASE_APPROVAL_MODE: 'required',
  SUPABASE_APPROVED_ACTIONS: 'supabase.branch.create',
  SUPABASE_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows an explicitly approved write', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertActionAllowed(config, 'supabase.branch.create')).not.toThrow();
  });
  it('denies unapproved writes', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertActionAllowed(config, 'supabase.branch.merge')).toThrow(/APPROVAL_REQUIRED/);
  });
  it('keeps destructive operations disabled by default', () => {
    const config = loadConfig({ ...baseEnv, SUPABASE_APPROVED_ACTIONS: 'supabase.branch.delete' });
    expect(() => assertActionAllowed(config, 'supabase.branch.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('SupabaseClient', () => {
  it('keeps the access token only in the provider Authorization header', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer sbp_test_token' });
      return new Response(JSON.stringify([]), { status: 200 });
    });
    const client = new SupabaseClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v1/projects')).resolves.toEqual([]);
  });

  it('does not retry authorization failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 }));
    const client = new SupabaseClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v1/projects')).rejects.toBeInstanceOf(SupabaseApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('never retries writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ message: 'Busy' }), { status: 503 }));
    const client = new SupabaseClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/v1/projects/x/branches', { method: 'POST', body: { branch_name: 'dev' } })).rejects.toBeInstanceOf(SupabaseApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling and honors reset header', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'rate limited' }), { status: 429, headers: { 'x-ratelimit-reset': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ ref: 'abc' }]), { status: 200 }));
    const client = new SupabaseClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request<unknown[]>('/v1/projects')).resolves.toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');

  it('registers only scoped provider tools', () => {
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m => m[1]);
    expect(names).toEqual(expect.arrayContaining([
      'supabase.organization.list', 'supabase.organization.get', 'supabase.organization.member.list',
      'supabase.project.list', 'supabase.organization.project.list', 'supabase.function.list',
      'supabase.branch.list', 'supabase.branch.get', 'supabase.branch.create',
      'supabase.branch.merge', 'supabase.branch.delete', 'supabase.log.query'
    ]));
    expect(source).not.toContain('execute_any_api_request');
  });

  it('contains strict safety checks for destructive branch deletion and bounded log queries', () => {
    expect(source).toContain("assertActionAllowed(config, 'supabase.branch.delete', true)");
    expect(source).toContain('log query window cannot exceed 24 hours');
    expect(source).toContain('one SELECT/WITH statement without semicolons');
  });
});
