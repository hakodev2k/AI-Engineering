import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { FormstackClient } from '../src/client.js';
import { authorize, assertSafeWebhookUrl } from '../src/policy.js';
import { registerTools } from '../src/tools.js';

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.FORMSTACK_ACCESS_TOKEN;
  delete process.env.FORMSTACK_API_BASE;
  delete process.env.FORMSTACK_REQUEST_TIMEOUT_MS;
});

describe('configuration and policy', () => {
  it('requires a credential without exposing it to tool callers', () => {
    expect(() => loadConfig()).toThrow('FORMSTACK_ACCESS_TOKEN is required');
    process.env.FORMSTACK_ACCESS_TOKEN = 'fs_pat_test_only';
    expect(loadConfig().accessToken).toBe('fs_pat_test_only');
  });

  it('rejects insecure API bases', () => {
    process.env.FORMSTACK_ACCESS_TOKEN = 'fs_pat_test_only';
    process.env.FORMSTACK_API_BASE = 'http://example.com/api/v2025';
    expect(() => loadConfig()).toThrow('must use HTTPS');
  });

  it('requires approval for writes when configured', () => {
    expect(() => authorize('WRITE', undefined, { requireWriteApproval: true, destructiveEnabled: false })).toThrow('approval');
    expect(() => authorize('WRITE', true, { requireWriteApproval: true, destructiveEnabled: false })).not.toThrow();
  });

  it('keeps destructive tools disabled by default', () => {
    expect(() => authorize('DESTRUCTIVE', true, { requireWriteApproval: true, destructiveEnabled: false })).toThrow('disabled');
  });

  it('blocks localhost and private webhook targets', () => {
    expect(() => assertSafeWebhookUrl('https://localhost/hook')).toThrow();
    expect(() => assertSafeWebhookUrl('https://10.0.0.5/hook')).toThrow();
    expect(() => assertSafeWebhookUrl('https://hooks.example.com/formstack')).not.toThrow();
  });
});

describe('tool registration', () => {
  it('registers the documented capability surface', () => {
    const registered: string[] = [];
    const fakeServer = { registerTool(name: string) { registered.push(name); } } as any;
    const fakeClient = { request: vi.fn() } as any;
    const cfg = {
      accessToken: 'secret', apiBase: 'https://www.formstack.com/api/v2025', timeoutMs: 1000,
      requireWriteApproval: true, destructiveEnabled: false
    };
    const names = registerTools(fakeServer, fakeClient, cfg);
    expect(names).toHaveLength(15);
    expect(registered).toEqual(names);
    expect(names).toContain('formstack.submission.delete');
    expect(names).toContain('formstack.webhook.create');
  });
});

describe('HTTP reliability', () => {
  it('sends bearer auth and parses a successful response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ forms: [] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new FormstackClient({
      accessToken: 'fs_pat_test_only', apiBase: 'https://www.formstack.com/api/v2025', timeoutMs: 1000,
      requireWriteApproval: true, destructiveEnabled: false
    });
    await expect(client.request('GET', '/forms')).resolves.toEqual({ forms: [] });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer fs_pat_test_only');
  });

  it('retries bounded read throttling but never blindly retries writes', async () => {
    const readFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ forms: [1] }), { status: 200 }));
    vi.stubGlobal('fetch', readFetch);
    const client = new FormstackClient({
      accessToken: 'x', apiBase: 'https://www.formstack.com/api/v2025', timeoutMs: 1000,
      requireWriteApproval: true, destructiveEnabled: false
    });
    await client.request('GET', '/forms');
    expect(readFetch).toHaveBeenCalledTimes(2);

    const writeFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'unavailable' }), { status: 503 }));
    vi.stubGlobal('fetch', writeFetch);
    await expect(client.request('POST', '/forms', { name: 'A' })).rejects.toThrow('unavailable');
    expect(writeFetch).toHaveBeenCalledTimes(1);
  });
});
