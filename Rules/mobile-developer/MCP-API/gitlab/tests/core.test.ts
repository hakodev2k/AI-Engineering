import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { ApprovalRequiredError, assertSafeProjectId, requireApproval } from '../src/policy.js';
import { GitLabApiError, GitLabRestClient } from '../src/gitlab-rest.js';

const env = {
  GITLAB_BASE_URL: 'https://gitlab.example.com/',
  GITLAB_TOKEN: 'test-token',
  GITLAB_USE_UPSTREAM_MCP: 'false',
  GITLAB_REQUIRE_WRITE_APPROVAL: 'true',
  GITLAB_HTTP_TIMEOUT_MS: '5000',
  GITLAB_MAX_RETRIES: '1'
};

describe('configuration', () => {
  it('normalizes URLs without exposing tokens', () => {
    const cfg = loadConfig(env);
    expect(cfg.apiBaseUrl).toBe('https://gitlab.example.com/api/v4');
    expect(cfg.mcpUrl).toBe('https://gitlab.example.com/api/v4/mcp');
    expect(cfg.useUpstreamMcp).toBe(false);
  });

  it('rejects missing credentials', () => {
    expect(() => loadConfig({ GITLAB_BASE_URL: 'https://gitlab.com' })).toThrow();
  });
});

describe('approval policy', () => {
  it('allows reads without approval', () => expect(() => requireApproval('read', 'READ', undefined, true)).not.toThrow());
  it('blocks writes without approval by default', () => expect(() => requireApproval('write', 'WRITE', false, true)).toThrow(ApprovalRequiredError));
  it('always blocks high risk actions without approval', () => expect(() => requireApproval('retry', 'HIGH_RISK', false, false)).toThrow(ApprovalRequiredError));
  it('encodes safe project paths and rejects control characters', () => {
    expect(assertSafeProjectId('group/project')).toBe('group%2Fproject');
    expect(() => assertSafeProjectId('bad\nproject')).toThrow();
  });
});

describe('REST reliability', () => {
  it('retries a throttled GET once and then succeeds', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'rate limited' }), { status: 429, headers: { 'content-type': 'application/json', 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1 }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new GitLabRestClient(loadConfig(env), fetchMock as typeof fetch);
    await expect(client.request<{ id: number }>('GET', '/projects/1')).resolves.toEqual({ id: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry POST operations', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'server error' }), { status: 500, headers: { 'content-type': 'application/json' } }));
    const client = new GitLabRestClient(loadConfig(env), fetchMock as typeof fetch);
    await expect(client.request('POST', '/projects/1/issues', { body: { title: 'x' }, retryable: false })).rejects.toBeInstanceOf(GitLabApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('caps pagination at 100 results per page', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new GitLabRestClient(loadConfig(env), fetchMock as typeof fetch);
    await client.paged('/projects', {}, 1, 500);
    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain('per_page=100');
  });
});
