import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { FastlyClient, FastlyError } from '../src/client.js';
import { buildTools } from '../src/tools.js';

const env={FASTLY_API_TOKEN:'x',FASTLY_API_BASE_URL:'https://api.fastly.com',FASTLY_TIMEOUT_MS:'1000',FASTLY_MAX_RETRIES:'0',FASTLY_APPROVAL_SECRET:'0123456789abcdef',FASTLY_REQUIRE_WRITE_APPROVAL:'true'};

describe('configuration',()=>{
  it('loads safe Fastly config',()=>expect(loadConfig(env as any).apiBaseUrl).toBe('https://api.fastly.com'));
  it('rejects arbitrary API hosts',()=>expect(()=>loadConfig({...env,FASTLY_API_BASE_URL:'https://evil.example'} as any)).toThrow());
});

describe('client and tools',()=>{
  it('registers the intended tool set',()=>{
    const cfg=loadConfig(env as any); const client=new FastlyClient(cfg, vi.fn() as any);
    expect(buildTools(client,cfg).map(x=>x.name)).toEqual(expect.arrayContaining(['fastly.service.list','fastly.version.activate','fastly.cache.purge_all']));
  });
  it('maps provider errors and does not retry permission failures',async()=>{
    const f=vi.fn().mockResolvedValue(new Response('forbidden',{status:403}));
    const c=new FastlyClient(loadConfig(env as any),f as any);
    await expect(c.request('GET','/service')).rejects.toBeInstanceOf(FastlyError);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('honors retry-after on throttling',async()=>{
    const f=vi.fn().mockResolvedValueOnce(new Response('slow',{status:429,headers:{'retry-after':'0'}})).mockResolvedValueOnce(new Response('[]',{status:200}));
    const c=new FastlyClient(loadConfig({...env,FASTLY_MAX_RETRIES:'1'} as any),f as any);
    await expect(c.request('GET','/service')).resolves.toEqual([]);
    expect(f).toHaveBeenCalledTimes(2);
  });
  it('requires approval for activation and binds approval to payload',async()=>{
    const f=vi.fn().mockResolvedValue(new Response('{"status":"ok"}',{status:200}));
    const cfg=loadConfig(env as any); const c=new FastlyClient(cfg,f as any);
    const tool=buildTools(c,cfg).find(x=>x.name==='fastly.version.activate')!;
    await expect(tool.run({serviceId:'svc1',version:2})).rejects.toThrow('explicit human approval');
    const payload={serviceId:'svc1',version:2};
    const approvalId=approvalDigest(cfg.approvalSecret!,'fastly.version.activate',payload);
    await expect(tool.run({...payload,approvalId})).resolves.toEqual({status:'ok'});
  });
  it('validates identifiers before transport',async()=>{
    const cfg=loadConfig(env as any); const c=new FastlyClient(cfg,vi.fn() as any);
    const tool=buildTools(c,cfg).find(x=>x.name==='fastly.service.get')!;
    expect(()=>tool.schema.parse({serviceId:'../bad'})).toThrow();
  });
});
