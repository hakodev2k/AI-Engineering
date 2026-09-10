import { beforeEach, describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { assertAllowed, TOOL_POLICY } from '../src/policy.js';
import { OvhClient, OvhError } from '../src/client.js';

const env = { ...process.env };
beforeEach(() => {
  process.env = { ...env, OVH_APPLICATION_KEY:'app', OVH_APPLICATION_SECRET:'secret', OVH_CONSUMER_KEY:'consumer', OVH_ENDPOINT:'https://eu.api.ovh.com/1.0', OVH_ENABLE_HIGH_RISK:'false' };
});

describe('configuration and policy', () => {
  it('rejects arbitrary API origins', () => {
    process.env.OVH_ENDPOINT = 'https://evil.example/1.0';
    expect(() => loadConfig()).toThrow(/official OVHcloud/);
  });
  it('classifies reboots as high risk', () => {
    expect(TOOL_POLICY['ovhcloud.vps.reboot']).toBe('HIGH_RISK');
  });
  it('denies high risk by default and accepts exact approved payload when enabled', () => {
    process.env.OVH_ENABLE_HIGH_RISK = 'true';
    process.env.OVH_APPROVAL_SECRET = '0123456789abcdef0123456789abcdef';
    const c = loadConfig();
    const payload = { serviceName:'vps-1' };
    const approvalId = approvalDigest(c.approvalSecret!, 'ovhcloud.vps.reboot', payload);
    expect(() => assertAllowed(c, 'ovhcloud.vps.reboot', { ...payload, approvalId })).not.toThrow();
    expect(() => assertAllowed(c, 'ovhcloud.vps.reboot', { serviceName:'vps-2', approvalId })).toThrow(/approval/);
  });
});

describe('client', () => {
  it('signs authenticated reads and returns JSON', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(String(Math.floor(Date.now()/1000)), {status:200}))
      .mockResolvedValueOnce(new Response(JSON.stringify({nichandle:'xx'}), {status:200}));
    const client = new OvhClient(loadConfig(), fetchMock as unknown as typeof fetch);
    const result = await client.request<any>('GET','/me');
    expect(result.nichandle).toBe('xx');
    const headers = fetchMock.mock.calls[1][1].headers as Record<string,string>;
    expect(headers['X-Ovh-Application']).toBe('app');
    expect(headers['X-Ovh-Consumer']).toBe('consumer');
    expect(headers['X-Ovh-Signature']).toMatch(/^\$1\$[a-f0-9]{40}$/);
  });
  it('does not retry writes', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(String(Math.floor(Date.now()/1000)), {status:200}))
      .mockResolvedValueOnce(new Response('busy', {status:503}));
    const client = new OvhClient(loadConfig(), fetchMock as unknown as typeof fetch);
    await expect(client.request('POST','/vps/x/reboot',{},false)).rejects.toBeInstanceOf(OvhError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
