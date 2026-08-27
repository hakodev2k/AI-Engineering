import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { AmplitudeClient, AmplitudeError } from '../src/client.js';

const cfg = { apiKey: 'api', secretKey: 'secret', region: 'us' as const, timeoutMs: 1000, maxRetries: 1, approvalSecret: 'approve' };

describe('configuration and policy', () => {
  it('requires credentials and validates region', () => {
    expect(() => loadConfig({})).toThrow('AMPLITUDE_API_KEY');
    expect(() => loadConfig({ AMPLITUDE_API_KEY: 'a', AMPLITUDE_SECRET_KEY: 's', AMPLITUDE_REGION: 'xx' })).toThrow('AMPLITUDE_REGION');
  });
  it('requires approval for writes', () => {
    expect(TOOL_POLICY['amplitude.event.ingest'].risk).toBe('WRITE');
    expect(() => assertApproval('amplitude.event.ingest', undefined, 'approve')).toThrow('explicit approval');
    expect(() => assertApproval('amplitude.event.ingest', approvalDigest('approve', 'amplitude.event.ingest'), 'approve')).not.toThrow();
  });
});

describe('AmplitudeClient', () => {
  it('uses basic auth for dashboard reads', async () => {
    const fetchFn = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new AmplitudeClient(cfg, fetchFn as typeof fetch);
    await client.dashboard('/api/2/events/list');
    const init = fetchFn.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string,string>).Authorization).toMatch(/^Basic /);
  });
  it('retries bounded 429 reads and honors retry-after', async () => {
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(new Response('{"error":"rate"}', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }));
    const client = new AmplitudeClient(cfg, fetchFn as typeof fetch);
    await expect(client.dashboard('/api/2/events/list')).resolves.toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
  it('does not retry write ingestion', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('{"error":"rate"}', { status: 429 }));
    const client = new AmplitudeClient(cfg, fetchFn as typeof fetch);
    await expect(client.ingest([{ event_type: 'x', user_id: '12345' }], undefined)).rejects.toBeInstanceOf(AmplitudeError);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
  it('blocks profile API in EU region', async () => {
    const client = new AmplitudeClient({ ...cfg, region: 'eu' }, vi.fn() as unknown as typeof fetch);
    await expect(client.profile({ user_id: 'u' })).rejects.toThrow('not available');
  });
});
