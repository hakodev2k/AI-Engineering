import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { LookerRestClient } from '../src/rest.js';

const baseEnv = { LOOKER_BASE_URL: 'https://example.looker.com', LOOKER_CLIENT_ID: 'id', LOOKER_CLIENT_SECRET: 'secret' };

describe('configuration and policy', () => {
  it('requires https Looker base URL', () => expect(() => loadConfig({ LOOKER_BASE_URL: 'http://x' })).toThrow(/https/));
  it('classifies destructive and read tools', () => {
    expect(TOOL_POLICY['looker.model.list'].risk).toBe('READ');
    expect(TOOL_POLICY['looker.scheduled_plan.delete'].risk).toBe('DESTRUCTIVE');
  });
  it('denies high-risk calls without approval and accepts valid approval', () => {
    const secret = 'unit-test-secret';
    expect(() => assertApproval('looker.scheduled_plan.create', undefined, secret)).toThrow(/approval/);
    expect(() => assertApproval('looker.scheduled_plan.create', approvalDigest(secret, 'looker.scheduled_plan.create'), secret)).not.toThrow();
  });
});

describe('REST transport', () => {
  it('logs in, isolates credentials, and performs an authenticated read', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'tok', expires_in: 3600 }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: '1' }]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const client = new LookerRestClient(loadConfig(baseEnv), fetchMock as unknown as typeof fetch);
    const result = await client.request<unknown[]>('GET', '/lookml_models');
    expect(result).toHaveLength(1);
    const second = fetchMock.mock.calls[1];
    expect(second[1].headers.Authorization).toBe('token tok');
    expect(JSON.stringify(second)).not.toContain('secret');
  });

  it('retries 429 for safe reads and honors retry-after', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'tok', expires_in: 3600 }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response('rate', { status: 429, headers: { 'retry-after': '1' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'ok' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const client = new LookerRestClient(loadConfig({ ...baseEnv, LOOKER_MAX_RETRIES: '1' }), fetchMock as unknown as typeof fetch);
    const promise = client.request('GET', '/looks/1');
    await vi.advanceTimersByTimeAsync(1000);
    await expect(promise).resolves.toEqual({ id: 'ok' });
    vi.useRealTimers();
  });

  it('does not retry explicitly non-retryable writes', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'tok', expires_in: 3600 }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response('busy', { status: 503 }));
    const client = new LookerRestClient(loadConfig(baseEnv), fetchMock as unknown as typeof fetch);
    await expect(client.request('POST', '/scheduled_plans', { body: {}, retryable: false })).rejects.toThrow(/503/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
