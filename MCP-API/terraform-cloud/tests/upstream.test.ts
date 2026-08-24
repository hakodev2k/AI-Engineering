import { describe, expect, it, vi } from 'vitest';
import { HybridUpstream, TerraformCloudError } from '../src/upstream.js';
import type { Config } from '../src/config.js';

const config: Config = { address:'https://app.terraform.io', token:'token', command:'missing-binary', args:[], allowedOrgs:new Set(), allowedWorkspaces:new Set(), timeoutMs:1000, maxRetries:0, enableWrite:false, enableDestructive:false };

describe('REST fallback', () => {
  it('adds bearer auth and parses JSON', async () => {
    const fetchMock = vi.fn(async (_url: URL, init: RequestInit) => {
      expect((init.headers as Record<string,string>).Authorization).toBe('Bearer token');
      return new Response(JSON.stringify({data:[]}), {status:200, headers:{'content-type':'application/json'}});
    });
    const u = new HybridUpstream(config, fetchMock as unknown as typeof fetch);
    await expect(u.request('GET','/organizations')).resolves.toEqual({data:[]});
  });

  it('does not retry write failures', async () => {
    const fetchMock = vi.fn(async () => new Response('bad', {status:500}));
    const u = new HybridUpstream({...config, maxRetries:3}, fetchMock as unknown as typeof fetch);
    await expect(u.request('POST','/runs',{})).rejects.toBeInstanceOf(TerraformCloudError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
