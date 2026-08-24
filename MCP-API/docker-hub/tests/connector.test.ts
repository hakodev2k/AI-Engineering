import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, assertTargetAllowed, loadConfig } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { DockerHubRestClient } from '../src/rest.js';

describe('configuration and policy', () => {
  it('parses allowlists and MCP configuration', () => {
    const config = loadConfig({
      DOCKER_HUB_ALLOWED_NAMESPACES: 'acme,public',
      DOCKER_HUB_ALLOWED_REPOSITORIES: 'acme/api,web',
      DOCKER_HUB_MCP_ARGS_JSON: '["server.js","--transport=stdio"]'
    });
    expect(config.allowedNamespaces.has('acme')).toBe(true);
    expect(config.mcpArgs).toEqual(['server.js', '--transport=stdio']);
    expect(() => assertTargetAllowed(config, 'other')).toThrow(/Namespace not allowed/);
    expect(() => assertTargetAllowed(config, 'acme', 'other')).toThrow(/Repository not allowed/);
    expect(() => assertTargetAllowed(config, 'acme', 'api')).not.toThrow();
  });

  it('rejects invalid retry configuration', () => {
    expect(() => loadConfig({ DOCKER_HUB_MAX_RETRIES: '9' })).toThrow(/0..5/);
  });

  it('requires cryptographic approval for writes', () => {
    const secret = 'test-secret';
    expect(() => assertApproval('dockerhub.repository.create', undefined, secret)).toThrow(/explicit human approval/);
    expect(() => assertApproval('dockerhub.repository.create', '0'.repeat(64), secret)).toThrow(/Invalid approval/);
    expect(() => assertApproval('dockerhub.repository.create', approvalDigest(secret, 'dockerhub.repository.create'), secret)).not.toThrow();
    expect(() => assertApproval('dockerhub.repository.get', undefined, undefined)).not.toThrow();
  });
});

describe('DockerHubRestClient', () => {
  it('exchanges PAT for JWT and keeps PAT out of resource requests', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fakeFetch = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      calls.push({ url, init });
      if (url.endsWith('/auth/token')) return new Response(JSON.stringify({ access_token: 'jwt-token' }), { status: 200, headers: { 'content-type': 'application/json' } });
      return new Response(JSON.stringify({ name: 'demo' }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const config = loadConfig({ DOCKER_HUB_USERNAME: 'alice', DOCKER_HUB_PAT: 'secret-pat', DOCKER_HUB_MCP_ENABLED: 'false' });
    const client = new DockerHubRestClient(config, fakeFetch);
    const result = await client.get<{ name: string }>('/namespaces/alice/repositories/demo', undefined, true);
    expect(result.name).toBe('demo');
    expect(calls).toHaveLength(2);
    expect(calls[0].init?.body).toContain('secret-pat');
    expect((calls[1].init?.headers as Record<string, string>).Authorization).toBe('Bearer jwt-token');
    expect(JSON.stringify(calls[1])).not.toContain('secret-pat');
  });

  it('retries bounded read throttling using Retry-After', async () => {
    let count = 0;
    const fakeFetch = vi.fn(async () => {
      count++;
      if (count === 1) return new Response('slow down', { status: 429, headers: { 'retry-after': '0' } });
      return new Response(JSON.stringify({ results: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const config = loadConfig({ DOCKER_HUB_MAX_RETRIES: '1', DOCKER_HUB_MCP_ENABLED: 'false' });
    const client = new DockerHubRestClient(config, fakeFetch);
    await expect(client.get('/namespaces/library/repositories')).resolves.toEqual({ results: [] });
    expect(count).toBe(2);
  });

  it('does not retry writes', async () => {
    let count = 0;
    const fakeFetch = vi.fn(async (input: string | URL | Request) => {
      count++;
      if (String(input).endsWith('/auth/token')) return new Response(JSON.stringify({ access_token: 'jwt-token' }), { status: 200, headers: { 'content-type': 'application/json' } });
      return new Response('server error', { status: 500 });
    }) as unknown as typeof fetch;
    const config = loadConfig({ DOCKER_HUB_USERNAME: 'alice', DOCKER_HUB_PAT: 'secret', DOCKER_HUB_MAX_RETRIES: '3', DOCKER_HUB_MCP_ENABLED: 'false' });
    const client = new DockerHubRestClient(config, fakeFetch);
    await expect(client.post('/namespaces/alice/repositories', { name: 'demo' })).rejects.toThrow(/500/);
    expect(count).toBe(2);
  });
});
