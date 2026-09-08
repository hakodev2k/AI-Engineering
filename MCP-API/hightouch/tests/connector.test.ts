import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getApiKey } from '../src/auth.js';
import { HightouchClient, HightouchError } from '../src/client.js';
import { config } from '../src/config.js';
import { assertAllowed, toolPolicies } from '../src/policy.js';

describe('Hightouch connector', () => {
  const originalKey = process.env.HIGHTOUCH_API_KEY;
  const originalHighRisk = config.allowHighRisk;

  beforeEach(() => {
    process.env.HIGHTOUCH_API_KEY = 'test-key';
    config.allowHighRisk = false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    config.allowHighRisk = originalHighRisk;
    if (originalKey === undefined) delete process.env.HIGHTOUCH_API_KEY;
    else process.env.HIGHTOUCH_API_KEY = originalKey;
  });

  it('requires an API key', () => {
    delete process.env.HIGHTOUCH_API_KEY;
    expect(() => getApiKey()).toThrow('HIGHTOUCH_API_KEY is required');
  });

  it('declares exactly the intended scoped tool policies', () => {
    expect(toolPolicies).toHaveLength(10);
    expect(toolPolicies.every((p) => p.name.startsWith('hightouch.'))).toBe(true);
    expect(toolPolicies.find((p) => p.name === 'hightouch.sync.trigger')?.permission).toBe('HIGH_RISK');
  });

  it('sends bearer authentication and never returns the credential', async () => {
    const mockFetch = vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      expect(String(input)).toBe('https://api.hightouch.com/api/v1/syncs');
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
      return new Response(JSON.stringify({ data: [{ id: 1 }] }), { status: 200 });
    });
    const client = new HightouchClient('https://api.hightouch.com/api/v1', mockFetch as typeof fetch, 1000, 0);
    const result = await client.listSyncs();
    expect(JSON.stringify(result)).not.toContain('test-key');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('sends the documented run limit query', async () => {
    const mockFetch = vi.fn(async (input: URL | RequestInfo) => {
      expect(String(input)).toBe('https://api.hightouch.com/api/v1/syncs/sync-1/runs?limit=12');
      return new Response(JSON.stringify([]), { status: 200 });
    });
    const client = new HightouchClient('https://api.hightouch.com/api/v1', mockFetch as typeof fetch, 1000, 0);
    await client.listSyncRuns('sync-1', 12);
  });

  it('retries a safe GET after throttling', async () => {
    let calls = 0;
    const mockFetch = vi.fn(async () => {
      calls += 1;
      if (calls === 1) return new Response('{"error":"rate limited"}', { status: 429, headers: { 'retry-after': '0' } });
      return new Response('[]', { status: 200 });
    });
    const client = new HightouchClient('https://api.hightouch.com/api/v1', mockFetch as typeof fetch, 1000, 1);
    await client.listModels();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry a sync trigger', async () => {
    const mockFetch = vi.fn(async () => new Response('{"error":"server error"}', { status: 500 }));
    const client = new HightouchClient('https://api.hightouch.com/api/v1', mockFetch as typeof fetch, 1000, 3);
    await expect(client.triggerSync('sync-1')).rejects.toBeInstanceOf(HightouchError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('requires operator enablement and explicit approval for high-risk actions', () => {
    expect(() => assertAllowed('hightouch.sync.trigger', true)).toThrow('HIGHTOUCH_ALLOW_HIGH_RISK');
    config.allowHighRisk = true;
    expect(() => assertAllowed('hightouch.sync.trigger', false)).toThrow('explicit human approval');
    expect(() => assertAllowed('hightouch.sync.trigger', true)).not.toThrow();
  });

  it('allows reads without write elevation', () => {
    expect(() => assertAllowed('hightouch.sync.list')).not.toThrow();
  });

  it('rejects insecure API base URLs', () => {
    expect(() => new HightouchClient('http://api.hightouch.com/api/v1')).toThrow('must use https');
  });
});
