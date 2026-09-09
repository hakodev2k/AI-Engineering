import {describe, expect, it, vi} from 'vitest';
import {ChecklyApiError, ChecklyClient} from '../src/client.js';
import type {Config} from '../src/config.js';

const cfg: Config = {
  apiKey:'cu_test', accountId:'account', apiBase:'https://api.checklyhq.com', mcpUrl:'https://api.checklyhq.com/mcp',
  mcpEnabled:true, timeoutMs:1000, maxReadRetries:2, requireWriteApproval:true
};

describe('ChecklyClient', () => {
  it('keeps credentials in transport headers and parses successful JSON', async () => {
    const mocked = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect((init?.headers as Record<string,string>).Authorization).toBe('Bearer cu_test');
      expect((init?.headers as Record<string,string>)['X-Checkly-Account']).toBe('account');
      return new Response(JSON.stringify([{id:'check-1'}]), {status:200, headers:{'content-type':'application/json'}});
    });
    const client = new ChecklyClient(cfg, mocked as typeof fetch);
    await expect(client.request('GET','/v1/checks')).resolves.toEqual([{id:'check-1'}]);
  });

  it('retries read-only 429 responses and honors Retry-After', async () => {
    let calls = 0;
    const mocked = vi.fn(async () => {
      calls++;
      if (calls === 1) return new Response(JSON.stringify({message:'rate limited'}), {status:429, headers:{'retry-after':'0'}});
      return new Response(JSON.stringify({ok:true}), {status:200});
    });
    const client = new ChecklyClient(cfg, mocked as typeof fetch);
    await expect(client.request('GET','/v1/checks')).resolves.toEqual({ok:true});
    expect(calls).toBe(2);
  });

  it('does not retry authentication failures', async () => {
    const mocked = vi.fn(async () => new Response(JSON.stringify({message:'Bad Token'}), {status:401}));
    const client = new ChecklyClient(cfg, mocked as typeof fetch);
    await expect(client.request('GET','/v1/checks')).rejects.toBeInstanceOf(ChecklyApiError);
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  it('never retries POST operations, including throttling', async () => {
    const mocked = vi.fn(async () => new Response(JSON.stringify({message:'rate limited'}), {status:429}));
    const client = new ChecklyClient(cfg, mocked as typeof fetch);
    await expect(client.request('POST','/v2/check-sessions/trigger',{target:{checkId:['c1']}})).rejects.toBeInstanceOf(ChecklyApiError);
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  it('blocks arbitrary cross-origin or traversal-like paths', async () => {
    const client = new ChecklyClient(cfg, vi.fn() as unknown as typeof fetch);
    await expect(client.request('GET','/v1/../admin')).rejects.toThrow(/Unsafe/);
  });
});
