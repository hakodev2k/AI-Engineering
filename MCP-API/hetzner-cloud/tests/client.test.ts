import { beforeEach,describe,expect,it,vi } from 'vitest';

describe('HetznerClient',()=>{
  beforeEach(()=>{vi.resetModules();process.env.HETZNER_CLOUD_TOKEN='test-token';process.env.HETZNER_CLOUD_MAX_RETRIES='0';});
  it('sends bearer auth and parses responses',async()=>{const fetcher=vi.fn(async(_u:any,init:any)=>{expect(init.headers.Authorization).toBe('Bearer test-token');return new Response(JSON.stringify({servers:[{id:1}]}),{status:200,headers:{'Content-Type':'application/json'}});});const { HetznerClient }=await import('../src/client.js');const data=await new HetznerClient(fetcher as any).request<any>('GET','servers');expect(data.servers[0].id).toBe(1);});
  it('maps provider errors',async()=>{const fetcher=vi.fn(async()=>new Response(JSON.stringify({error:{code:'unauthorized'}}),{status:401,headers:{'Content-Type':'application/json'}}));const { HetznerClient,HetznerError }=await import('../src/client.js');await expect(new HetznerClient(fetcher as any).request('GET','servers')).rejects.toBeInstanceOf(HetznerError);});
  it('handles 204 deletes without JSON parsing',async()=>{const fetcher=vi.fn(async()=>new Response(null,{status:204}));const { HetznerClient }=await import('../src/client.js');await expect(new HetznerClient(fetcher as any).request('DELETE','servers/1',undefined,false)).resolves.toBeUndefined();});
});
