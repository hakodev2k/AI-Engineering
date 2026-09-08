import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  process.env.TRIGGER_SECRET_KEY = 'tr_dev_test';
  process.env.TRIGGER_API_URL = 'https://api.trigger.dev';
});

describe('TriggerClient', () => {
  it('adds bearer auth and returns JSON', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => new Response(JSON.stringify({ id: 'run_abc' }), { status: 200, headers: { 'content-type': 'application/json' } }));
    vi.resetModules();
    const { TriggerClient } = await import('../src/client.js');
    const client = new TriggerClient(fetchMock as typeof fetch);
    const result = await client.triggerTask('task-a', { x: 1 });
    expect(result.id).toBe('run_abc');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect((init.headers as Record<string,string>).Authorization).toBe('Bearer tr_dev_test');
  });

  it('does not retry POST failures', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ error: 'busy' }), { status: 500 }));
    vi.resetModules();
    const { TriggerClient } = await import('../src/client.js');
    const client = new TriggerClient(fetchMock as typeof fetch);
    await expect(client.replayRun('run_abc')).rejects.toThrow('Trigger.dev API 500');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
