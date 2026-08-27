import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertApproval, POLICY } from '../src/policy.js';
import { TailscaleClient, TailscaleError } from '../src/client.js';

const baseEnv = { TAILSCALE_TAILNET: 'example.com', TAILSCALE_API_KEY: 'tskey-api-test', TAILSCALE_APPROVAL_SECRET: 'human-secret' };

describe('configuration', () => {
  it('requires tailnet and credentials', () => {
    expect(() => loadConfig({})).toThrow(/TAILSCALE_TAILNET/);
    expect(() => loadConfig({ TAILSCALE_TAILNET: 'x' })).toThrow(/Configure either/);
  });
  it('uses safe defaults', () => {
    const c = loadConfig(baseEnv);
    expect(c.apiBaseUrl).toBe('https://api.tailscale.com/api/v2');
    expect(c.timeoutMs).toBe(15000);
  });
});

describe('permission policy', () => {
  it('classifies dangerous actions', () => {
    expect(POLICY['tailscale.device.remove']).toEqual({ risk:'DESTRUCTIVE', approval:true });
    expect(POLICY['tailscale.routes.update']).toEqual({ risk:'HIGH_RISK', approval:true });
  });
  it('denies and then accepts input-bound approval', () => {
    const c = loadConfig(baseEnv);
    expect(() => assertApproval(c, 'tailscale.device.remove', { deviceId:'1' })).toThrow(/explicit approval/);
    const approvalId = approvalDigest('human-secret', 'tailscale.device.remove', '{"deviceId":"1"}');
    expect(() => assertApproval(c, 'tailscale.device.remove', { deviceId:'1', approvalId })).not.toThrow();
  });
});

describe('REST client', () => {
  beforeEach(() => vi.restoreAllMocks());
  it('uses Basic auth for API access tokens and parses JSON', async () => {
    const f = vi.fn().mockResolvedValue(new Response(JSON.stringify({ devices:[] }), { status:200 }));
    vi.stubGlobal('fetch', f);
    const c = new TailscaleClient(loadConfig(baseEnv));
    await expect(c.request('GET', c.tailnetPath('/devices'))).resolves.toEqual({ devices:[] });
    expect((f.mock.calls[0][1].headers as Record<string,string>).authorization).toMatch(/^Basic /);
  });
  it('maps provider errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('forbidden', { status:403 })));
    const c = new TailscaleClient(loadConfig(baseEnv));
    await expect(c.request('GET', '/device/1')).rejects.toBeInstanceOf(TailscaleError);
  });
  it('never retries DELETE automatically', async () => {
    const f = vi.fn().mockResolvedValue(new Response('throttled', { status:429, headers:{'retry-after':'0'} }));
    vi.stubGlobal('fetch', f);
    const c = new TailscaleClient(loadConfig(baseEnv));
    await expect(c.request('DELETE', '/device/1')).rejects.toBeInstanceOf(TailscaleError);
    expect(f).toHaveBeenCalledTimes(1);
  });
});
