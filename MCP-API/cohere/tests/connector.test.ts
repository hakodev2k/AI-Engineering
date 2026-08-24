import { describe, expect, it, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import { CohereClient, CohereError } from '../src/client.js';
import { assertModelAllowed, loadConfig } from '../src/config.js';
import { approvalDigest, assertWriteApproval } from '../src/policy.js';

const baseEnv = {
  COHERE_API_KEY: 'test-key',
  COHERE_BASE_URL: 'https://api.cohere.com',
  COHERE_TIMEOUT_MS: '1000',
  COHERE_MAX_RETRIES: '0'
};

describe('configuration and policy', () => {
  it('requires an API key', () => {
    expect(() => loadConfig({})).toThrow('COHERE_API_KEY is required');
  });

  it('rejects insecure base URLs', () => {
    expect(() => loadConfig({ ...baseEnv, COHERE_BASE_URL: 'http://example.com' })).toThrow('must use https');
  });

  it('enforces model allowlists', () => {
    const cfg = loadConfig({ ...baseEnv, COHERE_ALLOWED_MODELS: 'command-a-03-2025,embed-v4.0' });
    expect(() => assertModelAllowed(cfg, 'embed-v4.0')).not.toThrow();
    expect(() => assertModelAllowed(cfg, 'other-model')).toThrow('Model not allowed');
  });

  it('requires valid approval for billable write tools by default', () => {
    const cfg = loadConfig({ ...baseEnv, COHERE_APPROVAL_SECRET: 'secret' });
    expect(() => assertWriteApproval(cfg, 'cohere.chat.create')).toThrow('Explicit approval required');
    const approval = approvalDigest('secret', 'cohere.chat.create');
    expect(() => assertWriteApproval(cfg, 'cohere.chat.create', approval)).not.toThrow();
  });
});

describe('HTTP client', () => {
  it('keeps credentials in the connector and sends bearer auth', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-key');
      expect(new Headers(init?.headers).get('X-Client-Name')).toBe('ai-engineering-mcp');
      return new Response(JSON.stringify({ models: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new CohereClient(loadConfig(baseEnv), fetchMock);
    await expect(client.get('/v1/models')).resolves.toEqual({ models: [] });
  });

  it('preserves provider errors and retry-after', async () => {
    const fetchMock = vi.fn(async () => new Response('{"message":"rate limited"}', { status: 429, headers: { 'retry-after': '7' } })) as unknown as typeof fetch;
    const client = new CohereClient(loadConfig(baseEnv), fetchMock);
    try {
      await client.post('/v2/rerank', {});
      throw new Error('expected request to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(CohereError);
      expect((error as CohereError).status).toBe(429);
      expect((error as CohereError).retryAfterSeconds).toBe(7);
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not retry billable POST operations after server errors', async () => {
    const fetchMock = vi.fn(async () => new Response('server error', { status: 503 })) as unknown as typeof fetch;
    const cfg = loadConfig({ ...baseEnv, COHERE_MAX_RETRIES: '3' });
    const client = new CohereClient(cfg, fetchMock);
    await expect(client.post('/v2/chat', {})).rejects.toBeInstanceOf(CohereError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('MCP tool registration', () => {
  it('registers the documented scoped tools without a raw request escape hatch', async () => {
    const source = await readFile(new URL('../src/server.ts', import.meta.url), 'utf8');
    for (const tool of [
      'cohere.model.list', 'cohere.model.get', 'cohere.chat.create', 'cohere.embedding.create',
      'cohere.rerank.create', 'cohere.tokenize.create', 'cohere.detokenize.create',
      'cohere.dataset.list', 'cohere.dataset.get'
    ]) expect(source).toContain(`server.tool('${tool}'`);
    expect(source).not.toContain('execute_any_api_request');
  });
});
