import {describe,it,expect,vi,afterEach} from 'vitest'; import {MercuryClient,MercuryError} from '../src/client.js';
afterEach(()=>vi.unstubAllGlobals());
describe('MercuryClient',()=>{
 it('rejects missing credentials',()=>expect(()=>new MercuryClient('','https://api.mercury.com/api/v1')).toThrow());
 it('requires HTTPS',()=>expect(()=>new MercuryClient('x','http://example.com')).toThrow());
 it('adds bearer auth and parses JSON',async()=>{const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}}));vi.stubGlobal('fetch',f);const c=new MercuryClient('secret','https://api.mercury.com/api/v1');expect(await c.request('/accounts')).toEqual({ok:true});expect(f.mock.calls[0][1].headers.authorization).toBe('Bearer secret')});
 it('maps authentication failure',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('',{status:401})));await expect(new MercuryClient('x','https://api.mercury.com/api/v1').request('/accounts')).rejects.toMatchObject({status:401})});
 it('does not retry write throttling',async()=>{const f=vi.fn().mockResolvedValue(new Response('',{status:429,headers:{'retry-after':'1'}}));vi.stubGlobal('fetch',f);await expect(new MercuryClient('x','https://api.mercury.com/api/v1').request('/ar/invoices',{method:'POST'},false)).rejects.toBeInstanceOf(MercuryError);expect(f).toHaveBeenCalledTimes(1)});
});
