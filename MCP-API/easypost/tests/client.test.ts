import { describe, expect, it, vi } from 'vitest';
import { EasyPostClient, EasyPostError } from '../src/client.js';
import { loadConfig } from '../src/config.js';

const cfg = loadConfig({ EASYPOST_API_KEY: 'EZTK_test_key_12345', EASYPOST_MAX_READ_RETRIES: '1' });

describe('EasyPostClient', () => {
  it('keeps credentials in the transport and parses JSON', async () => {
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(String(new Headers(init?.headers).get('authorization'))).toMatch(/^Basic /);
      return new Response(JSON.stringify({ id: 'adr_1' }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new EasyPostClient(cfg, fetchMock as unknown as typeof fetch);
    await expect(client.request('GET', '/addresses/adr_1')).resolves.toEqual({ id: 'adr_1' });
  });

  it('retries a throttled read but never retries writes', async () => {
    const readFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: 'slow down' } }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ addresses: [] }), { status: 200 }));
    const readClient = new EasyPostClient(cfg, readFetch as unknown as typeof fetch);
    await readClient.request('GET', '/addresses');
    expect(readFetch).toHaveBeenCalledTimes(2);

    const writeFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { message: 'busy' } }), { status: 503 }));
    const writeClient = new EasyPostClient(cfg, writeFetch as unknown as typeof fetch);
    await expect(writeClient.request('POST', '/addresses', { address: {} })).rejects.toBeInstanceOf(EasyPostError);
    expect(writeFetch).toHaveBeenCalledTimes(1);
  });
});
