import { describe, expect, it, vi } from 'vitest';
import { ReplicateClient, ReplicateError } from '../src/client.js';
import { assertDeploymentAllowed, assertModelAllowed, loadConfig } from '../src/config.js';
import { assertApproval } from '../src/policy.js';
import { approvalDigest } from '../src/config.js';

const baseEnv = {
  REPLICATE_API_TOKEN: 'r8_test_token',
  REPLICATE_APPROVAL_SECRET: 'secret',
  REPLICATE_ALLOWED_OWNERS: 'acme',
  REPLICATE_ALLOWED_MODELS: 'acme/model-a',
  REPLICATE_ALLOWED_DEPLOYMENTS: 'acme/prod',
  REPLICATE_TIMEOUT_MS: '5000',
  REPLICATE_MAX_RETRIES: '2'
};

describe('configuration and policy', () => {
  it('requires an API token', () => {
    expect(() => loadConfig({})).toThrow(/REPLICATE_API_TOKEN/);
  });

  it('enforces model and deployment allowlists', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertModelAllowed(config, 'acme', 'model-a')).not.toThrow();
    expect(() => assertModelAllowed(config, 'other', 'model-a')).toThrow(/owner not allowed/);
    expect(() => assertDeploymentAllowed(config, 'acme', 'prod')).not.toThrow();
    expect(() => assertDeploymentAllowed(config, 'acme', 'other')).toThrow(/Deployment not allowed/);
  });

  it('requires a deterministic approval token for writes', () => {
    const token = approvalDigest('secret', 'replicate.prediction.create');
    expect(() => assertApproval('replicate.prediction.create', token, 'secret')).not.toThrow();
    expect(() => assertApproval('replicate.prediction.create', undefined, 'secret')).toThrow(/requires explicit approval/);
    expect(() => assertApproval('replicate.prediction.get', undefined, undefined)).not.toThrow();
  });
});

describe('ReplicateClient', () => {
  it('adds bearer auth and parses JSON', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer r8_test_token' });
      return new Response(JSON.stringify({ id: 'p1' }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new ReplicateClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await expect(client.get<{ id: string }>('/predictions/p1')).resolves.toEqual({ id: 'p1' });
  });

  it('retries throttled GET requests but not POST requests', async () => {
    const getMock = vi.fn()
      .mockResolvedValueOnce(new Response('{"detail":"throttled"}', { status: 429 }))
      .mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }));
    const client = new ReplicateClient(loadConfig({ ...baseEnv, REPLICATE_MAX_RETRIES: '1' }), getMock as typeof fetch);
    await expect(client.get('/predictions/p1')).resolves.toEqual({ ok: true });
    expect(getMock).toHaveBeenCalledTimes(2);

    const postMock = vi.fn().mockResolvedValue(new Response('{"detail":"throttled"}', { status: 429 }));
    const postClient = new ReplicateClient(loadConfig({ ...baseEnv, REPLICATE_MAX_RETRIES: '2' }), postMock as typeof fetch);
    await expect(postClient.post('/predictions', { version: 'v', input: {} })).rejects.toBeInstanceOf(ReplicateError);
    expect(postMock).toHaveBeenCalledTimes(1);
  });

  it('maps provider errors without leaking the API token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"detail":"bad request"}', { status: 400 }));
    const client = new ReplicateClient(loadConfig(baseEnv), fetchMock as typeof fetch);
    await expect(client.get('/bad')).rejects.toThrow('Replicate API 400');
    try { await client.get('/bad'); } catch (error) {
      expect(String(error)).not.toContain('r8_test_token');
    }
  });
});
