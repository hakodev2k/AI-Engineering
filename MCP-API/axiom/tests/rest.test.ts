import { describe, expect, it, vi } from 'vitest';
import type { Config } from '../src/config.js';
import { AxiomRestClient } from '../src/rest.js';
const config: Config = { token:'secret',apiUrl:'https://api.axiom.co',mcpUrl:'https://mcp.axiom.co/mcp',timeoutMs:1000,maxRetries:1,requireWriteApproval:true,enableDestructive:false,approvedActions:new Set() };

describe('REST client', () => {
  it('keeps tokens in transport headers', async () => {
    const f = vi.fn(async (_u:any, init:any) => new Response(JSON.stringify([]), { status: 200 }));
    await new AxiomRestClient(config, f as any).listDatasets();
    expect(f.mock.calls[0][1].headers.Authorization).toBe('Bearer secret');
  });
  it('retries 429 reads', async () => {
    const f = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({message:'slow'}), {status:429,headers:{'retry-after':'0'}})).mockResolvedValueOnce(new Response(JSON.stringify([]), {status:200}));
    await new AxiomRestClient(config, f as any).listDatasets();
    expect(f).toHaveBeenCalledTimes(2);
  });
  it('does not blindly retry create monitor', async () => {
    const f = vi.fn().mockResolvedValue(new Response(JSON.stringify({message:'down'}), {status:500}));
    await expect(new AxiomRestClient(config, f as any).createMonitor({name:'x'})).rejects.toMatchObject({status:500});
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('uses PUT for monitor replacement', async () => {
    const f = vi.fn(async (_u:any, init:any) => new Response(JSON.stringify({ok:true}), {status:200}));
    await new AxiomRestClient(config, f as any).updateMonitor('mon_1', {name:'x'});
    expect(f.mock.calls[0][1].method).toBe('PUT');
  });
});
