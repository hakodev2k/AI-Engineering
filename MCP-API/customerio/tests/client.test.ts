import { describe,it,expect,vi } from 'vitest';
import { CustomerIoClient } from '../src/client.js';
import type { Config } from '../src/config.js';
const config:Config={appApiKey:'secret',region:'us',apiBaseUrl:'https://api.customer.io',mcpUrl:'https://mcp.customer.io/mcp',timeoutMs:1000,maxRetries:1,requireWriteApproval:true,approvedActions:new Set()};
describe('client',()=>{
  it('keeps credentials in Authorization header',async()=>{const f=vi.fn(async()=>new Response(JSON.stringify({segments:[]}),{status:200}));const c=new CustomerIoClient(config,f as any);await c.request('GET','/v1/segments');expect(f.mock.calls[0][1].headers.Authorization).toBe('Bearer secret');});
  it('retries a rate-limited read',async()=>{const f=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({error:'rate'}),{status:429,headers:{'retry-after':'0'}})).mockResolvedValueOnce(new Response(JSON.stringify({ok:true}),{status:200}));const c=new CustomerIoClient(config,f as any);expect(await c.request<any>('GET','/v1/segments')).toEqual({ok:true});expect(f).toHaveBeenCalledTimes(2);});
  it('does not blindly retry a send',async()=>{const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({error:'down'}),{status:500}));const c=new CustomerIoClient(config,f as any);await expect(c.request('POST','/v1/send/email',{body:{},idempotent:false})).rejects.toMatchObject({status:500});expect(f).toHaveBeenCalledTimes(1);});
});
