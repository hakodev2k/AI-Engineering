import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { RenderConnectorClient, RenderError } from '../src/client.js';

const baseEnv = { RENDER_API_KEY: 'rnd_test_key', RENDER_APPROVAL_SECRET: 'unit-test-secret' };

describe('configuration', () => {
  it('requires a credential', () => expect(() => loadConfig({})).toThrow('RENDER_API_KEY'));
  it('rejects non-HTTPS upstreams', () => expect(() => loadConfig({ ...baseEnv, RENDER_API_BASE_URL: 'http://localhost:3000' })).toThrow('HTTPS'));
  it('bounds retries', () => expect(loadConfig({ ...baseEnv, RENDER_MAX_RETRIES: '99' }).maxRetries).toBe(5));
});

describe('policy', () => {
  it('marks read and operational tools correctly', () => {
    expect(TOOL_POLICY['render.service.get'].risk).toBe('READ');
    expect(TOOL_POLICY['render.deploy.trigger'].risk).toBe('HIGH_RISK');
  });
  it('requires a matching approval token for high-risk operations', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertApproval(config, 'render.deploy.trigger', 'srv-1')).toThrow('explicit human approval');
    const token = approvalDigest('unit-test-secret', 'render.deploy.trigger', 'srv-1');
    expect(() => assertApproval(config, 'render.deploy.trigger', 'srv-1', token)).not.toThrow();
    expect(() => assertApproval(config, 'render.deploy.trigger', 'srv-2', token)).toThrow('Invalid approval');
  });
});

describe('REST transport', () => {
  it('keeps the credential in the Authorization header and parses JSON', async () => {
    const fetchMock = vi.fn(async (_url: any, init: any) => {
      expect(init.headers.Authorization).toBe('Bearer rnd_test_key');
      return new Response(JSON.stringify([{ id: 'srv-1' }]), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new RenderConnectorClient(loadConfig(baseEnv), fetchMock as any);
    await expect(client.rest('GET', '/services')).resolves.toEqual([{ id: 'srv-1' }]);
  });

  it('does not retry write operations after throttling', async () => {
    const fetchMock = vi.fn(async () => new Response('rate limited', { status: 429, headers: { 'retry-after': '0' } }));
    const client = new RenderConnectorClient(loadConfig(baseEnv), fetchMock as any);
    await expect(client.rest('POST', '/services/srv-1/restart')).rejects.toBeInstanceOf(RenderError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries bounded safe reads on transient server errors', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('temporary', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'srv-1' }), { status: 200 }));
    const client = new RenderConnectorClient(loadConfig({ ...baseEnv, RENDER_MAX_RETRIES: '1' }), fetchMock as any);
    await expect(client.rest('GET', '/services/srv-1')).resolves.toEqual({ id: 'srv-1' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('maps authentication failures without retrying', async () => {
    const fetchMock = vi.fn(async () => new Response('unauthorized', { status: 401 }));
    const client = new RenderConnectorClient(loadConfig(baseEnv), fetchMock as any);
    await expect(client.rest('GET', '/services')).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
