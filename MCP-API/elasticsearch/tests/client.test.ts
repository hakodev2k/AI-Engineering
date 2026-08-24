import { describe, expect, it, vi } from 'vitest';
import { ElasticClient, ElasticHttpError } from '../src/client.js';
import { loadConfig } from '../src/config.js';

const cfg = loadConfig({
  ELASTICSEARCH_URL: 'https://elastic.example',
  ELASTICSEARCH_API_KEY: 'encoded-key',
  ELASTIC_TIMEOUT_MS: '5000',
  ELASTIC_MAX_RETRIES: '1'
});

describe('ElasticClient', () => {
  it('sends isolated API-key credentials and parses JSON', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('ApiKey encoded-key');
      return new Response(JSON.stringify({ count: 7 }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new ElasticClient(cfg, fetchMock);
    await expect(client.post('/products/_count', { query: { match_all: {} } })).resolves.toEqual({ count: 7 });
  });

  it('retries a read-style 429 with bounded retry', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      if (calls === 1) return new Response('busy', { status: 429 });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as unknown as typeof fetch;
    const client = new ElasticClient(cfg, fetchMock);
    await expect(client.get('/products/_mapping')).resolves.toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it('does not retry a destructive request when retryable=false', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      return new Response('busy', { status: 429 });
    }) as unknown as typeof fetch;
    const client = new ElasticClient(cfg, fetchMock);
    await expect(client.request('DELETE', '/products/_doc/1', undefined, undefined, false)).rejects.toBeInstanceOf(ElasticHttpError);
    expect(calls).toBe(1);
  });

  it('maps provider errors without leaking credentials', async () => {
    const fetchMock = vi.fn(async () => new Response('{"error":"forbidden"}', { status: 403 })) as unknown as typeof fetch;
    const client = new ElasticClient(cfg, fetchMock);
    await expect(client.get('/private/_mapping')).rejects.toThrow(/Elasticsearch 403/);
  });
});
