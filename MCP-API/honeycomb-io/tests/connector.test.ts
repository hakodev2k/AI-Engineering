import {describe,it,expect,vi} from 'vitest'; import {loadConfig} from '../src/auth.js'; import {HoneycombClient,HoneycombError} from '../src/client.js'; import {buildTools} from '../src/tools.js';
const cfg={apiKey:'secret',baseUrl:'https://api.honeycomb.io',timeoutMs:1000,maxRetries:0,requireWriteApproval:true};
describe('Honeycomb connector',()=>{
 it('rejects missing credentials',()=>expect(()=>loadConfig({})).toThrow(/API_KEY/));
 it('rejects non-official API origins',()=>expect(()=>loadConfig({HONEYCOMB_API_KEY:'x',HONEYCOMB_API_BASE_URL:'https://evil.test'})).toThrow(/official/));
 it('registers twelve scoped tools',()=>expect(buildTools(new HoneycombClient(cfg,vi.fn() as any))).toHaveLength(12));
 it('validates identifiers',()=>{const t=buildTools(new HoneycombClient(cfg,vi.fn() as any))[1];expect(()=>t.schema.parse({dataset:'../x'})).toThrow();});
 it('performs a read with isolated auth',async()=>{const f=vi.fn(async(_u:any,o:any)=>{expect(o.headers['X-Honeycomb-Team']).toBe('secret');return new Response('[]',{status:200});});const t=buildTools(new HoneycombClient(cfg,f as any))[0];await t.run(t.schema.parse({}));expect(f).toHaveBeenCalledOnce();});
 it('denies write without approval',async()=>{const t=buildTools(new HoneycombClient(cfg,vi.fn() as any))[2];await expect(t.run(t.schema.parse({name:'prod'}))).rejects.toThrow(/approval/);});
 it('allows approved write',async()=>{const f=vi.fn(async()=>new Response('{"slug":"prod"}',{status:201,headers:{'Content-Type':'application/json'}}));const t=buildTools(new HoneycombClient(cfg,f as any))[2];await t.run(t.schema.parse({name:'prod',approved:true}));expect(f).toHaveBeenCalledOnce();});
 it('maps authentication failure without retry',async()=>{const f=vi.fn(async()=>new Response('{"error":"unauthorized"}',{status:401}));const c=new HoneycombClient(cfg,f as any);await expect(c.request('GET','/1/datasets')).rejects.toBeInstanceOf(HoneycombError);expect(f).toHaveBeenCalledOnce();});
 it('preserves Retry-After on rate limit',async()=>{const f=vi.fn(async()=>new Response('{}',{status:429,headers:{'Retry-After':'7'}}));const c=new HoneycombClient(cfg,f as any);try{await c.request('GET','/1/datasets');throw new Error('expected');}catch(e){expect((e as HoneycombError).retryAfter).toBe('7');}});
 it('times out bounded requests',async()=>{const c=new HoneycombClient({...cfg,timeoutMs:10},((_u:any,o:any)=>new Promise((_r,reject)=>o.signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError'))))) as any);await expect(c.request('GET','/1/datasets')).rejects.toMatchObject({status:408});});
});
