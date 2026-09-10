import { describe, expect, it, vi } from 'vitest';
import { PingdomClient } from '../src/client.js';
import { invoke, schemas } from '../src/tools.js';
import { approvalDigest } from '../src/policy.js';
import type { Config } from '../src/config.js';

const config: Config = { apiToken: 'token', apiBaseUrl: 'https://api.pingdom.com/api/3.1', timeoutMs: 1000, maxReadRetries: 0, approvalSecret: 'x'.repeat(32), enableDestructive: true };

function clientWith(fetchFn: typeof fetch) { return new PingdomClient(config, fetchFn); }

describe('tools', () => {
  it('validates list pagination', () => {
    expect(() => schemas.checkList.parse({ limit: 25001 })).toThrow();
    expect(schemas.checkList.parse({})).toMatchObject({ limit: 100, offset: 0 });
  });

  it('maps check list filters to documented query names', async () => {
    const fetchFn = vi.fn(async (input: URL | RequestInfo) => {
      const url = new URL(String(input));
      expect(url.searchParams.get('include_tags')).toBe('true');
      expect(url.searchParams.get('tags')).toBe('api,prod');
      return new Response('{"checks":[]}', { status: 200 });
    }) as unknown as typeof fetch;
    await invoke(clientWith(fetchFn), config, 'pingdom.check.list', schemas.checkList.parse({ includeTags: true, tags: 'api,prod' }));
  });

  it('uses the documented bulk checks delete endpoint for one scoped check', async () => {
    const clean = { checkId: 7 };
    const args = { ...clean, approval: approvalDigest(config.approvalSecret, 'pingdom.check.delete', clean) };
    const fetchFn = vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      expect(new URL(String(input)).pathname).toBe('/api/3.1/checks');
      expect(init?.method).toBe('DELETE');
      expect(JSON.parse(String(init?.body))).toEqual({ delcheckids: '7' });
      return new Response('{"message":"ok"}', { status: 200 });
    }) as unknown as typeof fetch;
    await invoke(clientWith(fetchFn), config, 'pingdom.check.delete', args);
  });

  it('rejects invalid maintenance intervals before network execution', async () => {
    const clean = { description: 'release', from: 20, to: 10 };
    const args = { ...clean, approval: approvalDigest(config.approvalSecret, 'pingdom.maintenance.create', clean) };
    const fetchFn = vi.fn() as unknown as typeof fetch;
    await expect(invoke(clientWith(fetchFn), config, 'pingdom.maintenance.create', args)).rejects.toThrow(/greater/);
    expect(fetchFn).not.toHaveBeenCalled();
  });
});
