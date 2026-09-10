import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { SquarespaceClient, SquarespaceError } from '../src/client.js';
import { approvalDigest, enforcePolicy, TOOL_RISK } from '../src/policy.js';
import { buildTools } from '../src/tools.js';

const baseEnv: NodeJS.ProcessEnv = {
  SQUARESPACE_API_KEY: 'test-api-key',
  SQUARESPACE_USER_AGENT: 'SquarespaceConnectorTests/1.0',
  SQUARESPACE_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef'
};

describe('configuration', () => {
  it('requires exactly one credential', () => {
    expect(() => loadConfig({})).toThrow(/exactly one/);
    expect(() => loadConfig({ SQUARESPACE_API_KEY: 'a', SQUARESPACE_ACCESS_TOKEN: 'b' })).toThrow(/exactly one/);
  });

  it('pins the official API origin', () => {
    expect(() => loadConfig({ ...baseEnv, SQUARESPACE_API_BASE_URL: 'https://evil.example' })).toThrow(/official/);
  });
});

describe('policy', () => {
  it('classifies all expected tools', () => {
    expect(TOOL_RISK['squarespace.order.list']).toBe('READ');
    expect(TOOL_RISK['squarespace.product.update']).toBe('WRITE');
    expect(TOOL_RISK['squarespace.inventory.adjust']).toBe('HIGH_RISK');
  });

  it('denies high-risk operations by default', () => {
    const config = loadConfig(baseEnv);
    expect(() => enforcePolicy(config, 'squarespace.inventory.adjust', {})).toThrow(/disabled/);
  });

  it('binds approval to the exact write payload', () => {
    const config = loadConfig({ ...baseEnv, SQUARESPACE_REQUIRE_WRITE_APPROVAL: 'true' });
    const args = { productId: 'p1', name: 'New name' };
    const token = approvalDigest(config.approvalSecret!, 'squarespace.product.update', args);
    expect(() => enforcePolicy(config, 'squarespace.product.update', { ...args, approvalToken: token })).not.toThrow();
    expect(() => enforcePolicy(config, 'squarespace.product.update', { productId: 'p1', name: 'Changed', approvalToken: token })).toThrow(/does not match/);
  });
});

describe('client', () => {
  it('keeps credentials in the transport header', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect(new Headers(init?.headers).get('authorization')).toBe('Bearer test-api-key');
      expect(new Headers(init?.headers).get('user-agent')).toBe('SquarespaceConnectorTests/1.0');
      return new Response(JSON.stringify({ result: [] }), { status: 200 });
    });
    const client = new SquarespaceClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await client.request('GET', '/1.0/commerce/orders');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not retry writes', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ message: 'busy' }), { status: 503 }));
    const client = new SquarespaceClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await expect(client.request('PATCH', '/v1/contacts/c1', { body: { firstName: 'A' }, retryable: false })).rejects.toBeInstanceOf(SquarespaceError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('surfaces throttling and honors bounded behavior', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ message: 'slow down' }), { status: 429, headers: { 'Retry-After': '0' } }));
    const client = new SquarespaceClient(loadConfig({ ...baseEnv, SQUARESPACE_MAX_RETRIES: '1' }), fetchMock as typeof fetch);
    await expect(client.request('GET', '/1.0/commerce/orders')).rejects.toMatchObject({ status: 429, retryAfterSeconds: 0 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('tools', () => {
  it('registers one stable definition for each policy tool', () => {
    const config = loadConfig(baseEnv);
    const client = new SquarespaceClient(config, vi.fn() as unknown as typeof fetch);
    const tools = buildTools(client, config);
    expect(new Set(tools.map(t => t.name)).size).toBe(tools.length);
    expect(tools.map(t => t.name).sort()).toEqual(Object.keys(TOOL_RISK).sort());
  });

  it('rejects inventory writes before provider execution when disabled', async () => {
    const fetchMock = vi.fn();
    const config = loadConfig(baseEnv);
    const tools = buildTools(new SquarespaceClient(config, fetchMock as unknown as typeof fetch), config);
    const tool = tools.find(t => t.name === 'squarespace.inventory.adjust')!;
    await expect(tool.handler({ idempotencyKey: 'abc', incrementOperations: [{ variantId: 'v1', quantity: 1 }] })).rejects.toThrow(/disabled/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
