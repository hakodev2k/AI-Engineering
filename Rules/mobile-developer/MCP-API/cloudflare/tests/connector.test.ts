import { describe, expect, it, vi } from 'vitest';
import { CloudflareApiError, CloudflareClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  CLOUDFLARE_API_TOKEN: 'test-token',
  CLOUDFLARE_ALLOWED_WRITE_ZONE_IDS: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  CLOUDFLARE_APPROVAL_MODE: 'required',
  CLOUDFLARE_APPROVED_ACTIONS: 'cloudflare.dns.record.create',
  CLOUDFLARE_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows an explicitly approved write in an allowlisted zone', () => {
    const c = loadConfig(baseEnv); expect(() => assertWriteAllowed(c, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'cloudflare.dns.record.create')).not.toThrow();
  });
  it('denies writes to zones outside the operator allowlist', () => {
    const c = loadConfig(baseEnv); expect(() => assertWriteAllowed(c, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'cloudflare.dns.record.create')).toThrow(/WRITE_DENIED/);
  });
  it('denies unapproved write actions', () => {
    const c = loadConfig(baseEnv); expect(() => assertWriteAllowed(c, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'cloudflare.dns.record.update')).toThrow(/APPROVAL_REQUIRED/);
  });
  it('keeps destructive actions disabled by default', () => {
    const c = loadConfig({ ...baseEnv, CLOUDFLARE_APPROVED_ACTIONS: 'cloudflare.dns.record.delete' });
    expect(() => assertWriteAllowed(c, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'cloudflare.dns.record.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('CloudflareClient', () => {
  it('sends the API token only in the authorization header', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-token' });
      return new Response(JSON.stringify({ success: true, result: [{ id: '1' }] }), { status: 200 });
    });
    const client = new CloudflareClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    const result = await client.request<{success:boolean;result:unknown[]}>('/zones');
    expect(result.result).toHaveLength(1);
  });

  it('maps provider errors without retrying writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ success: false, errors: [{ code: 1000 }] }), { status: 403 }));
    const client = new CloudflareClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/zones/a/dns_records', { method: 'POST', body: {} })).rejects.toBeInstanceOf(CloudflareApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling and honors retry-after', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: false }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, result: [] }), { status: 200 }));
    const client = new CloudflareClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await client.request('/zones');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
