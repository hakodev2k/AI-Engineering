import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { approvalDigest, loadConfig, type OktaConfig } from '../src/config.js';
import { assertApproved, TOOL_POLICY } from '../src/policy.js';
import { OktaApiError, OktaRestClient, parseNextLink } from '../src/rest.js';
import { OktaRouter } from '../src/router.js';
import type { OktaUpstreamMcp } from '../src/upstream-mcp.js';
import { buildServer } from '../src/server.js';

const baseConfig = (): OktaConfig => loadConfig({
  OKTA_ORG_URL: 'https://example.okta.com',
  OKTA_ACCESS_TOKEN: 'test-access-token',
  OKTA_MCP_ENABLED: 'false',
  OKTA_ALLOW_REST_FALLBACK: 'true',
  OKTA_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef',
  OKTA_MAX_RETRIES: '1',
  OKTA_TIMEOUT_MS: '5000'
});

describe('configuration and policy', () => {
  it('requires https org URL and a usable transport', () => {
    expect(() => loadConfig({ OKTA_ORG_URL: 'http://example.okta.com', OKTA_MCP_ENABLED: 'false' })).toThrow();
    expect(() => loadConfig({ OKTA_ORG_URL: 'https://example.okta.com', OKTA_MCP_ENABLED: 'false' })).toThrow();
  });

  it('registers all 15 tool policies', () => {
    expect(Object.keys(TOOL_POLICY)).toHaveLength(15);
    expect(TOOL_POLICY['okta.group.member.add']?.risk).toBe('HIGH_RISK');
  });

  it('enforces approval tokens for mutating tools', () => {
    const cfg = baseConfig();
    const payload = { id: '00u1', profile: { department: 'Engineering' } };
    const token = approvalDigest(cfg.approvalSecret!, 'okta.user.update', payload);
    expect(() => assertApproved(cfg, 'okta.user.update', payload, token)).not.toThrow();
    expect(() => assertApproved(cfg, 'okta.user.update', payload, '0'.repeat(64))).toThrow(/Invalid approval/);
    expect(() => assertApproved(cfg, 'okta.user.get', { id: '00u1' })).not.toThrow();
  });
});

describe('REST reliability', () => {
  it('parses opaque next links', () => {
    expect(parseNextLink('<https://example.okta.com/api/v1/users?after=abc>; rel="next"')).toContain('after=abc');
  });

  it('retries bounded reads on 429 and succeeds', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ errorCode: 'E0000047', errorSummary: 'rate limit' }), { status: 429, headers: { 'content-type': 'application/json', 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: '00u1' }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new OktaRestClient(baseConfig(), fetchMock as typeof fetch);
    const result = await client.request('/api/v1/users/00u1');
    expect(result.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry mutating failures', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ errorCode: 'E0000006', errorSummary: 'forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } }));
    const client = new OktaRestClient(baseConfig(), fetchMock as typeof fetch);
    await expect(client.request('/api/v1/users/00u1', { method: 'POST', body: { profile: { title: 'x' } }, retryable: false })).rejects.toBeInstanceOf(OktaApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('paginates only same-origin Okta links and obeys maxItems', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: '1' }]), { status: 200, headers: { link: '<https://example.okta.com/api/v1/users?after=abc>; rel="next"' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: '2' }, { id: '3' }]), { status: 200 }));
    const client = new OktaRestClient(baseConfig(), fetchMock as typeof fetch);
    const items = await client.list('/api/v1/users?limit=2', 2);
    expect(items).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('MCP preference and fallback', () => {
  it('falls back to REST when official MCP startup fails', async () => {
    const cfg = { ...baseConfig(), mcpEnabled: true, allowRestFallback: true };
    const rest = { list: vi.fn().mockResolvedValue([{ id: '00u1' }]) };
    const mcp = { connect: vi.fn().mockRejectedValue(new Error('mcp unavailable')), hasTool: vi.fn(), call: vi.fn(), close: vi.fn() };
    const router = new OktaRouter(cfg, rest as never, mcp as unknown as OktaUpstreamMcp);
    const result = await router.execute('okta.user.search', { limit: 1 });
    expect(result.transport).toBe('rest');
    expect(rest.list).toHaveBeenCalledOnce();
  });

  it('uses official MCP when the mapped tool is available', async () => {
    const cfg = { ...baseConfig(), mcpEnabled: true, allowRestFallback: true };
    const rest = { list: vi.fn() };
    const mcp = { connect: vi.fn().mockResolvedValue(undefined), hasTool: vi.fn().mockReturnValue(true), call: vi.fn().mockResolvedValue([{ id: '00u1' }]), close: vi.fn() };
    const router = new OktaRouter(cfg, rest as never, mcp as unknown as OktaUpstreamMcp);
    const result = await router.execute('okta.user.search', { limit: 1 });
    expect(result.transport).toBe('mcp');
    expect(mcp.call).toHaveBeenCalledWith('list_users', expect.objectContaining({ limit: 1 }));
  });
});

describe('MCP tool registration', () => {
  beforeEach(() => {
    process.env.OKTA_ORG_URL = 'https://example.okta.com';
    process.env.OKTA_ACCESS_TOKEN = 'test-access-token';
    process.env.OKTA_MCP_ENABLED = 'false';
  });

  it('exposes exactly the intended 15 provider-scoped tools', async () => {
    const server = buildServer();
    const client = new Client({ name: 'test-client', version: '1.0.0' }, { versionNegotiation: { mode: 'legacy' } });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([client.connect(clientTransport), server.server.connect(serverTransport)]);
    const tools = await client.listTools();
    expect(tools.tools).toHaveLength(15);
    expect(tools.tools.map((t) => t.name)).toContain('okta.system_log.query');
    expect(tools.tools.map((t) => t.name)).toContain('okta.group.member.add');
    await client.close();
    await server.close();
  });
});
