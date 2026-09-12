import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { AhaClient, AhaError } from '../src/client.js';
import { requireApproval } from '../src/policy.js';

const base = { AHA_ACCOUNT_DOMAIN: 'acme.aha.io', AHA_ACCESS_TOKEN: 'secret', AHA_WRITE_APPROVED: 'false' } as NodeJS.ProcessEnv;

describe('config and policy', () => {
  it('loads valid configuration', () => expect(loadConfig(base).accountDomain).toBe('acme.aha.io'));
  it('rejects unsafe domains', () => expect(() => loadConfig({ ...base, AHA_ACCOUNT_DOMAIN: 'evil.example' })).toThrow());
  it('denies writes without approval', () => expect(() => requireApproval(loadConfig(base), 'WRITE', 'aha.feature.create')).toThrow(/approval/i));
  it('allows writes only when explicitly approved', () => expect(() => requireApproval(loadConfig({ ...base, AHA_WRITE_APPROVED: 'true' }), 'WRITE', 'x')).not.toThrow());
});

describe('client', () => {
  it('sends bearer auth without exposing token in URL', async () => {
    const mock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => new Response(JSON.stringify({ products: [] }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new AhaClient(loadConfig(base), mock as typeof fetch);
    await client.request('/products');
    const [url, init] = mock.mock.calls[0];
    expect(String(url)).not.toContain('secret');
    expect((init?.headers as Record<string,string>).Authorization).toBe('Bearer secret');
  });

  it('maps validation/auth errors without retrying', async () => {
    const mock = vi.fn(async () => new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 }));
    const client = new AhaClient(loadConfig(base), mock as typeof fetch);
    await expect(client.request('/products')).rejects.toBeInstanceOf(AhaError);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('retries bounded server failures for reads', async () => {
    const mock = vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 500 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ products: [] }), { status: 200 }));
    const client = new AhaClient(loadConfig({ ...base, AHA_MAX_RETRIES: '1' }), mock as typeof fetch);
    await expect(client.request('/products')).resolves.toEqual({ products: [] });
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry writes', async () => {
    const mock = vi.fn(async () => new Response('{}', { status: 500 }));
    const client = new AhaClient(loadConfig({ ...base, AHA_MAX_RETRIES: '3' }), mock as typeof fetch);
    await expect(client.request('/ideas/1', { method: 'PUT', body: { idea: { name: 'x' } } })).rejects.toBeInstanceOf(AhaError);
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
