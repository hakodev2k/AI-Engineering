import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, assertCollectionAllowed, loadConfig } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { WeaviateRestClient } from '../src/rest.js';
import { WeaviateMcpClient } from '../src/mcp.js';

describe('config and policy', () => {
  it('requires URL', () => expect(() => loadConfig({})).toThrow(/WEAVIATE_URL/));
  it('enforces collection allowlist', () => {
    const c = loadConfig({ WEAVIATE_URL: 'https://example.test', WEAVIATE_ALLOWED_COLLECTIONS: 'Docs' });
    expect(() => assertCollectionAllowed(c, 'Other')).toThrow(/not allowed/);
  });
  it('requires valid approval', () => {
    const token = approvalDigest('secret', 'weaviate.object.delete');
    expect(() => assertApproval('weaviate.object.delete', token, 'secret')).not.toThrow();
    expect(() => assertApproval('weaviate.object.delete', '0'.repeat(64), 'secret')).toThrow(/Invalid/);
  });
});

describe('REST reliability', () => {
  it('retries 429 then succeeds', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('rate', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const c = loadConfig({ WEAVIATE_URL: 'https://example.test', WEAVIATE_MAX_RETRIES: '1' });
    const client = new WeaviateRestClient(c, fetchMock as typeof fetch);
    await expect(client.get('/v1/schema')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry 4xx', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('forbidden', { status: 403 }));
    const c = loadConfig({ WEAVIATE_URL: 'https://example.test', WEAVIATE_MAX_RETRIES: '3' });
    const client = new WeaviateRestClient(c, fetchMock as typeof fetch);
    await expect(client.get('/v1/schema')).rejects.toThrow(/403/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('built-in MCP transport', () => {
  it('lists tools through JSON-RPC', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'weaviate-query-hybrid' }] } }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const c = loadConfig({ WEAVIATE_URL: 'https://example.test', WEAVIATE_MCP_ENABLED: 'true' });
    const mcp = new WeaviateMcpClient(c, fetchMock as typeof fetch);
    await expect(mcp.listTools()).resolves.toEqual({ tools: [{ name: 'weaviate-query-hybrid' }] });
  });
});
