import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe('UpCloudClient', () => {
  it('sends bearer token and parses a successful read response', async () => {
    vi.stubEnv('UPCLOUD_TOKEN', 'test-token'); vi.resetModules();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ zones: { zone: [] } }), { status: 200, headers: { 'content-type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    const { UpCloudClient } = await import('../src/client.js');
    const result = await new UpCloudClient().listZones();
    expect(result).toEqual({ zones: { zone: [] } });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer test-token');
  });

  it('does not retry non-retryable writes', async () => {
    vi.stubEnv('UPCLOUD_TOKEN', 'test-token'); vi.stubEnv('UPCLOUD_MAX_RETRIES', '3'); vi.resetModules();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { error_message: 'boom' } }), { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);
    const { UpCloudClient } = await import('../src/client.js');
    await expect(new UpCloudClient().startServer('00000000-0000-4000-8000-000000000000')).rejects.toThrow('boom');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
