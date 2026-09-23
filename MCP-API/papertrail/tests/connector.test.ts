import {describe,it,expect,vi} from 'vitest';import {loadConfig} from '../src/auth.js';import {PapertrailClient} from '../src/client.js';import {definitions,execute} from '../src/tools.js';
const cfg={token:'secret',baseUrl:'https://papertrailapp.com/api/v1',timeoutMs:50,maxRetries:1,allowWrites:false};
describe('papertrail connector',()=>{
 it('requires token',()=>expect(()=>loadConfig({})).toThrow(/required/));
 it('registers useful scoped tools',()=>{expect(definitions.length).toBe(11);expect(definitions.every(x=>x[0].startsWith('papertrail.'))).toBe(true)});
 it('searches with encoded query and token isolated in header',async()=>{const f=vi.fn(async(u:any,o:any)=>{expect(String(u)).toContain('q=error');expect(o.headers['X-Papertrail-Token']).toBe('secret');return new Response(JSON.stringify({events:[]}))});const c=new PapertrailClient(cfg,f as any);expect(await execute('papertrail.event.search',{q:'error'},c,cfg)).toEqual({events:[]})});
 it('rejects invalid search input',async()=>{const c=new PapertrailClient(cfg,vi.fn() as any);await expect(execute('papertrail.event.search',{limit:10001},c,cfg)).rejects.toThrow()});
 it('denies writes by default',async()=>{const c=new PapertrailClient(cfg,vi.fn() as any);await expect(execute('papertrail.search.create',{name:'Errors',query:'error',approved:true},c,cfg)).rejects.toThrow(/disabled/)});
 it('requires approval when writes enabled',async()=>{const c=new PapertrailClient({...cfg,allowWrites:true},vi.fn() as any);await expect(execute('papertrail.search.create',{name:'Errors',query:'error',approved:false},c,{...cfg,allowWrites:true})).rejects.toThrow(/approval/)});
 it('retries read throttling using rate headers',async()=>{let n=0;const f=vi.fn(async()=>++n===1?new Response('slow',{status:429,headers:{'retry-after':'0'}}):new Response(JSON.stringify([])));const c=new PapertrailClient(cfg,f as any);await c.listSystems();expect(f).toHaveBeenCalledTimes(2)});
 it('does not retry writes',async()=>{const f=vi.fn(async()=>new Response('down',{status:503}));const c=new PapertrailClient({...cfg,allowWrites:true},f as any);await expect(c.createSearch('x','y')).rejects.toThrow();expect(f).toHaveBeenCalledTimes(1)});
 it('maps authentication errors without retry',async()=>{const f=vi.fn(async()=>new Response('unauthorized',{status:401}));const c=new PapertrailClient(cfg,f as any);await expect(c.listGroups()).rejects.toThrow();expect(f).toHaveBeenCalledTimes(1)});
});
