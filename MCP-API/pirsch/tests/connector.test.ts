import {describe,it,expect,vi,beforeEach} from 'vitest'; import {PirschClient} from '../src/client.js'; import {invoke,schemas,specs} from '../src/tools.js';
beforeEach(()=>{process.env.PIRSCH_CLIENT_ID='id';process.env.PIRSCH_CLIENT_SECRET='secret';process.env.PIRSCH_REQUIRE_WRITE_APPROVAL='true'});
describe('Pirsch connector',()=>{
 it('registers useful tools',()=>expect(Object.keys(specs).length).toBe(9));
 it('validates date ranges',()=>expect(()=>schemas.range.parse({domainId:'x',from:'bad',to:'2026-09-17'})).toThrow());
 it('requires approval for writes',async()=>await expect(invoke('pirsch.traffic.page_view.track',{url:'https://x.test',ip:'1.1.1.1',user_agent:'ua'})).rejects.toThrow(/approval/i));
 it('authenticates then reads',async()=>{const f=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({access_token:'t',expires_at:'2099-01-01T00:00:00Z'}),{status:200})).mockResolvedValueOnce(new Response('[]',{status:200}));const c=new PirschClient(process.env,f as any);expect(await c.get('/api/v1/domain')).toEqual([]);expect(f).toHaveBeenCalledTimes(2)});
 it('maps invalid credentials',async()=>{const f=vi.fn().mockResolvedValue(new Response('{}',{status:401}));const c=new PirschClient(process.env,f as any);await expect(c.get('/api/v1/domain')).rejects.toMatchObject({status:401})});
 it('retries throttling boundedly',async()=>{const f=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({access_token:'t',expires_at:'2099-01-01T00:00:00Z'}),{status:200})).mockResolvedValueOnce(new Response('{}',{status:429})).mockResolvedValueOnce(new Response('[]',{status:200}));const c=new PirschClient(process.env,f as any);expect(await c.get('/api/v1/domain')).toEqual([])});
});
