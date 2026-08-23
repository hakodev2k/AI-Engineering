import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, assertApproval } from '../src/policy.js';
import { assertDropletAllowed, assertFirewallAllowed, loadConfig } from '../src/config.js';
import { DigitalOceanRest } from '../src/rest.js';

const baseEnv = {
  DIGITALOCEAN_API_TOKEN: 'dop_v1_test',
  DIGITALOCEAN_APPROVAL_SECRET: 'secret',
  DIGITALOCEAN_ALLOWED_DROPLET_IDS: '123,456',
  DIGITALOCEAN_ALLOWED_FIREWALL_IDS: '11111111-1111-1111-1111-111111111111'
};

describe('configuration and policy', () => {
  it('requires a token', () => expect(() => loadConfig({})).toThrow(/API_TOKEN/));

  it('enforces allowlists', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertDropletAllowed(config, 123)).not.toThrow();
    expect(() => assertDropletAllowed(config, 999)).toThrow(/not allowed/);
    expect(() => assertFirewallAllowed(config, '11111111-1111-1111-1111-111111111111')).not.toThrow();
    expect(() => assertFirewallAllowed(config, '22222222-2222-2222-2222-222222222222')).toThrow(/not allowed/);
  });

  it('requires timing-safe approval for write/high-risk tools', () => {
    const secret = 'secret';
    const token = approvalDigest(secret, 'digitalocean.droplet.reboot');
    expect(() => assertApproval('digitalocean.droplet.reboot', token, secret)).not.toThrow();
    expect(() => assertApproval('digitalocean.droplet.reboot', '0'.repeat(64), secret)).toThrow(/approval/);
  });
});

describe('REST client', () => {
  it('uses bearer auth and parses JSON', async () => {
    const fetchImpl = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer dop_v1_test');
      return new Response(JSON.stringify({ account: { uuid: 'abc' } }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new DigitalOceanRest(loadConfig(baseEnv), fetchImpl as unknown as typeof fetch);
    await expect(client.get('/account')).resolves.toEqual({ account: { uuid: 'abc' } });
  });

  it('retries 429 using bounded retry behavior', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ droplets: [] }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const client = new DigitalOceanRest(loadConfig({ ...baseEnv, DIGITALOCEAN_MAX_RETRIES: '1' }), fetchImpl as unknown as typeof fetch);
    await expect(client.get('/droplets')).resolves.toEqual({ droplets: [] });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('does not retry a permission error', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'forbidden' }), { status: 403 }));
    const client = new DigitalOceanRest(loadConfig({ ...baseEnv, DIGITALOCEAN_MAX_RETRIES: '3' }), fetchImpl as unknown as typeof fetch);
    await expect(client.get('/droplets')).rejects.toThrow(/403/);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
