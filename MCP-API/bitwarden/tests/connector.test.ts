import {describe,it,expect,vi} from 'vitest';
import {BitwardenAuth} from '../src/auth.js';
import {BitwardenClient,BitwardenError} from '../src/client.js';
import {tools} from '../src/tools.js';
const cfg={clientId:'organization.123',clientSecret:'secret',identityUrl:'https://identity.bitwarden.com'};
const response=(body:any,status=200,headers:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json',...headers}});
describe('bitwarden connector',()=>{
 it('rejects personal client ids',()=>expect(()=>new BitwardenAuth({...cfg,clientId:'user.x'})).toThrow());
 it('authenticates without exposing credentials',async()=>{const f=vi.fn(async()=>response({access_token:'t',expires_in:3600}));const a=new BitwardenAuth(cfg,f as any);expect(await a.token()).toBe('t');expect(String(f.mock.calls[0][1]?.body)).toContain('scope=api.organization')});
 it('registers nine scoped read tools',()=>{const fake={request:vi.fn()} as any;const x=tools(fake);expect(x).toHaveLength(9);expect(x.every(t=>t.risk==='READ')).toBe(true)});
 it('validates UUID and rejects extra input',()=>{const t=tools({request:vi.fn()} as any).find(x=>x.name==='bitwarden.member.get')!;expect(()=>t.schema.parse({id:'bad'})).toThrow();expect(()=>t.schema.parse({id:'550e8400-e29b-41d4-a716-446655440000',extra:true})).toThrow()});
 it('performs a read with bearer auth',async()=>{const f=vi.fn().mockResolvedValueOnce(response({access_token:'t'})).mockResolvedValueOnce(response({data:[]}));const c=new BitwardenClient(new BitwardenAuth(cfg,f as any),'https://api.bitwarden.com',1000,f as any);expect(await c.request('members')).toEqual({data:[]});expect(f.mock.calls[1][1].headers.authorization).toBe('Bearer t')});
 it('preserves continuation token',async()=>{const f=vi.fn().mockResolvedValueOnce(response({access_token:'t'})).mockResolvedValueOnce(response({data:[]}));const c=new BitwardenClient(new BitwardenAuth(cfg,f as any),'https://api.bitwarden.com',1000,f as any);await c.request('groups',{continuationToken:'next'});expect(String(f.mock.calls[1][0])).toContain('continuationToken=next')});
 it('does not retry authentication failures',async()=>{const f=vi.fn().mockResolvedValueOnce(response({access_token:'t'})).mockResolvedValueOnce(response({},401));const c=new BitwardenClient(new BitwardenAuth(cfg,f as any),'https://api.bitwarden.com',1000,f as any);await expect(c.request('members')).rejects.toBeInstanceOf(BitwardenError);expect(f).toHaveBeenCalledTimes(2)});
 it('retries throttling and honors bounded attempts',async()=>{const f=vi.fn().mockResolvedValueOnce(response({access_token:'t'})).mockResolvedValue(response({},429,{'retry-after':'0'}));const c=new BitwardenClient(new BitwardenAuth(cfg,f as any),'https://api.bitwarden.com',1000,f as any);await expect(c.request('members')).rejects.toMatchObject({status:429});expect(f).toHaveBeenCalledTimes(4)});
 it('maps timeout',async()=>{const f=vi.fn(async(_u:any,o:any)=>{await new Promise((_,rej)=>o.signal.addEventListener('abort',()=>rej(Object.assign(new Error('x'),{name:'AbortError'}))));});const c=new BitwardenClient(new BitwardenAuth(cfg,vi.fn(async()=>response({access_token:'t'})) as any),'https://api.bitwarden.com',1,f as any);await expect(c.request('members')).rejects.toThrow('timed out')});
});
