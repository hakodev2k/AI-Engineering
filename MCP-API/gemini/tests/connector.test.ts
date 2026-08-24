import { describe, expect, it, vi } from 'vitest';
import { GeminiClient, GeminiApiError } from '../src/client.js';
import { assertModelAllowed, assertUploadPathAllowed, loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval } from '../src/policy.js';

const baseEnv = { GEMINI_API_KEY: 'test-key', GEMINI_ALLOWED_MODELS: 'gemini-3.5-flash,gemini-embedding-001' };

describe('configuration and policy', () => {
  it('requires an API key', () => expect(() => loadConfig({})).toThrow(/GEMINI_API_KEY/));
  it('enforces model allowlist', () => {
    const c = loadConfig(baseEnv);
    expect(() => assertModelAllowed(c, 'gemini-3.5-flash')).not.toThrow();
    expect(() => assertModelAllowed(c, 'other-model')).toThrow(/not allowed/);
  });
  it('requires configured upload roots', () => {
    const c = loadConfig(baseEnv);
    expect(() => assertUploadPathAllowed(c, '/tmp/a.txt')).toThrow(/disabled/);
  });
  it('validates approval with constant-time digest', () => {
    const secret = 'secret';
    const token = approvalDigest(secret, 'gemini.file.delete');
    expect(() => assertApproval('gemini.file.delete', token, secret)).not.toThrow();
    expect(() => assertApproval('gemini.file.delete', '0'.repeat(64), secret)).toThrow(/Invalid approval/);
  });
});

describe('GeminiClient', () => {
  it('sends API key only in request headers', async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => new Response(JSON.stringify({ models: [] }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new GeminiClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await client.get('/models');
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).not.toContain('test-key');
    expect((init?.headers as Record<string,string>)['x-goog-api-key']).toBe('test-key');
  });

  it('maps provider errors and preserves Retry-After', async () => {
    const fetchMock = vi.fn(async () => new Response('{"error":"quota"}', { status: 429, headers: { 'retry-after': '7' } }));
    const cfg = loadConfig({ ...baseEnv, GEMINI_MAX_RETRIES: '0' });
    const client = new GeminiClient(cfg, fetchMock as typeof fetch);
    await expect(client.get('/models')).rejects.toMatchObject({ status: 429, retryAfterSeconds: 7 } satisfies Partial<GeminiApiError>);
  });

  it('does not blindly retry billable POST operations', async () => {
    const fetchMock = vi.fn(async () => new Response('{"error":"busy"}', { status: 503 }));
    const client = new GeminiClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await expect(client.post('/models/gemini-3.5-flash:generateContent', {})).rejects.toMatchObject({ status: 503 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries transient GET failures with a bound', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      return calls === 1 ? new Response('busy', { status: 503 }) : new Response('{"models":[]}', { status: 200 });
    });
    const client = new GeminiClient(loadConfig({ ...baseEnv, GEMINI_MAX_RETRIES: '1' }), fetchMock as typeof fetch);
    await expect(client.get('/models')).resolves.toEqual({ models: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
