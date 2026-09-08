import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  process.env.SCW_SECRET_KEY = 'test-secret';
  process.env.SCW_MAX_RETRIES = '1';
  vi.resetModules();
});

describe('ScalewayClient', () => {
  it('adds X-Auth-Token and parses successful responses', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>)['X-Auth-Token']).toBe('test-secret');
      return new Response(JSON.stringify({ servers: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const { ScalewayClient } = await import('../src/client.js');
    const client = new ScalewayClient(fetchMock as typeof fetch);
    await expect(client.request('GET', '/instance/v1/zones/fr-par-1/servers')).resolves.toEqual({ servers: [] });
  });

  it('paginates bounded list endpoints', async () => {
    let call = 0;
    const fetchMock = vi.fn(async () => {
      call++;
      const body = call === 1
        ? { projects: [{ id: 'a' }, { id: 'b' }], total_count: 3 }
        : { projects: [{ id: 'c' }], total_count: 3 };
      return new Response(JSON.stringify(body), { status: 200 });
    });
    const { ScalewayClient } = await import('../src/client.js');
    const client = new ScalewayClient(fetchMock as typeof fetch);
    const result = await client.listAll('/account/v3/projects?organization_id=x', 'projects', 2, 5);
    expect(result.items).toHaveLength(3);
    expect(result.pages).toBe(2);
  });

  it('does not retry non-idempotent writes', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ message: 'busy' }), { status: 503 }));
    const { ScalewayClient } = await import('../src/client.js');
    const client = new ScalewayClient(fetchMock as typeof fetch);
    await expect(client.request('POST', '/instance/v1/zones/fr-par-1/servers/x/action', { action: 'reboot' }, false)).rejects.toMatchObject({ status: 503 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
