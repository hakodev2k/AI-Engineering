import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { assertAllowed, TOOL_POLICY } from '../src/policy.js';
import { LaunchDarklyRestClient } from '../src/rest.js';
import { createServer } from '../src/server.js';

const baseConfig = loadConfig({
  LAUNCHDARKLY_ACCESS_TOKEN: 'test-token',
  LAUNCHDARKLY_API_BASE_URL: 'https://app.launchdarkly.com',
  LAUNCHDARKLY_MCP_MODE: 'rest',
  LAUNCHDARKLY_APPROVAL_SECRET: 'approval-secret'
});

describe('configuration and policy', () => {
  it('rejects non-HTTPS API base URLs', () => {
    expect(() => loadConfig({ LAUNCHDARKLY_API_BASE_URL: 'http://example.com' })).toThrow(/https/);
  });

  it('classifies destructive tools and keeps them disabled by default', () => {
    expect(TOOL_POLICY['launchdarkly.flag.delete'].risk).toBe('DESTRUCTIVE');
    const approval = approvalDigest('approval-secret', 'launchdarkly.flag.delete');
    expect(() => assertAllowed('launchdarkly.flag.delete', approval, baseConfig)).toThrow(/disabled/);
  });

  it('requires exact approval for writes', () => {
    expect(() => assertAllowed('launchdarkly.flag.create', undefined, baseConfig)).toThrow(/approval/);
    const approval = approvalDigest('approval-secret', 'launchdarkly.flag.create');
    expect(() => assertAllowed('launchdarkly.flag.create', approval, baseConfig)).not.toThrow();
  });

  it('constructs the MCP server without live credentials', () => {
    const config = loadConfig({ LAUNCHDARKLY_MCP_MODE: 'rest' });
    expect(createServer(config)).toBeTruthy();
  });
});

describe('REST transport', () => {
  it('sends authorization and version headers for reads', async () => {
    const fakeFetch = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => new Response(JSON.stringify({ items: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    }));
    const client = new LaunchDarklyRestClient(baseConfig, fakeFetch as typeof fetch);
    await client.listProjects(10, 0);
    const init = fakeFetch.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe('test-token');
    expect((init.headers as Record<string, string>)['LD-API-Version']).toBe('20240415');
  });

  it('retries bounded read requests on rate limiting and honors Retry-After', async () => {
    const fakeFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [] }), { status: 200 }));
    const config = { ...baseConfig, maxRetries: 1 };
    const client = new LaunchDarklyRestClient(config, fakeFetch as typeof fetch);
    await client.listProjects();
    expect(fakeFetch).toHaveBeenCalledTimes(2);
  });

  it('does not retry write operations blindly', async () => {
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify({ message: 'busy' }), { status: 503 }));
    const client = new LaunchDarklyRestClient({ ...baseConfig, maxRetries: 5 }, fakeFetch as typeof fetch);
    await expect(client.createFlag('proj', { name: 'Flag', key: 'flag' })).rejects.toMatchObject({ status: 503 });
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it('maps request timeouts to a stable connector error', async () => {
    const fakeFetch = vi.fn((_url: URL | RequestInfo, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
    }));
    const client = new LaunchDarklyRestClient({ ...baseConfig, timeoutMs: 1, maxRetries: 0 }, fakeFetch as typeof fetch);
    await expect(client.listProjects()).rejects.toMatchObject({ code: 'timeout' });
  });
});
