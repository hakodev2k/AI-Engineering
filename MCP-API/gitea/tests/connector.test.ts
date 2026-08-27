import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { GiteaClient, GiteaError } from '../src/client.js';
import { assertAllowed, TOOL_POLICY } from '../src/policy.js';

const baseEnv = {
  GITEA_BASE_URL: 'https://gitea.example.test',
  GITEA_TOKEN: 'secret-token',
  GITEA_TIMEOUT_MS: '5000',
  GITEA_MAX_RETRIES: '2'
};

describe('configuration', () => {
  it('requires base URL and token', () => {
    expect(() => loadConfig({})).toThrow(/GITEA_BASE_URL/);
    expect(() => loadConfig({ GITEA_BASE_URL: 'https://x.test' })).toThrow(/GITEA_TOKEN/);
  });
  it('rejects unsafe protocols and excessive retries', () => {
    expect(() => loadConfig({ ...baseEnv, GITEA_BASE_URL: 'file:///tmp/x' })).toThrow(/http or https/);
    expect(() => loadConfig({ ...baseEnv, GITEA_MAX_RETRIES: '99' })).toThrow(/MAX_RETRIES/);
  });
});

describe('permission boundary', () => {
  it('registers all expected policy classes', () => {
    expect(TOOL_POLICY['gitea.repository.search'].risk).toBe('READ');
    expect(TOOL_POLICY['gitea.issue.create'].risk).toBe('WRITE');
  });
  it('denies writes by default', () => {
    const c = loadConfig(baseEnv);
    expect(() => assertAllowed('gitea.issue.create', undefined, c)).toThrow(/disabled/);
  });
  it('requires cryptographic approval when writes are enabled', () => {
    const c = loadConfig({ ...baseEnv, GITEA_ALLOW_WRITES: 'true', GITEA_APPROVAL_SECRET: 'approval-secret' });
    expect(() => assertAllowed('gitea.issue.create', undefined, c)).toThrow(/explicit approval/);
    const approval = approvalDigest('approval-secret', 'gitea.issue.create');
    expect(() => assertAllowed('gitea.issue.create', approval, c)).not.toThrow();
  });
});

describe('HTTP client', () => {
  it('uses token header and pagination', async () => {
    const fetchFn = vi.fn(async (input: any, init: any) => {
      expect(String(input)).toContain('/api/v1/repos/search?q=hello&page=2&limit=10');
      expect(init.headers.Authorization).toBe('token secret-token');
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new GiteaClient(loadConfig(baseEnv), fetchFn as any);
    await client.searchRepositories('hello', 2, 10);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('maps permission errors without retrying', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ message: 'forbidden' }), { status: 403 }));
    const client = new GiteaClient(loadConfig(baseEnv), fetchFn as any);
    await expect(client.getRepository('acme', 'repo')).rejects.toMatchObject({ status: 403 });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('retries throttling and respects Retry-After', async () => {
    vi.useFakeTimers();
    let n = 0;
    const fetchFn = vi.fn(async () => {
      n++;
      if (n === 1) return new Response(JSON.stringify({ message: 'slow down' }), { status: 429, headers: { 'retry-after': '0' } });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    const p = new GiteaClient(loadConfig(baseEnv), fetchFn as any).getRepository('acme', 'repo');
    await vi.runAllTimersAsync();
    await expect(p).resolves.toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('does not blindly retry write operations', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ message: 'temporary' }), { status: 503 }));
    const client = new GiteaClient(loadConfig(baseEnv), fetchFn as any);
    await expect(client.createIssue('acme', 'repo', 'title')).rejects.toBeInstanceOf(GiteaError);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});
