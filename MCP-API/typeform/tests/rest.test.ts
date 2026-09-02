import { describe,it,expect,vi } from 'vitest';
import { TypeformRestClient } from '../src/rest.js';
import type { Config } from '../src/config.js';
const cfg:Config={mcpToken:'mcp',apiToken:'rest-secret',apiBaseUrl:'https://api.typeform.com',mcpUrl:'https://api.typeform.com/mcp',timeoutMs:1000,maxRetries:1,requireWriteApproval:true,approvedActions:new Set()};
describe('rest',()=>{
  it('keeps token inside transport',async()=>{const f=vi.fn(async()=>new Response(JSON.stringify({items:[]}),{status:200}));const c=new TypeformRestClient(cfg,f as any);await c.request('GET','/forms/x/responses');expect(f.mock.calls[0][1].headers.Authorization).toBe('Bearer rest-secret');});
  it('retries throttled reads',async()=>{const f=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({message:'slow'}),{status:429,headers:{'retry-after':'0'}})).mockResolvedValueOnce(new Response(JSON.stringify({items:[]}),{status:200}));const c=new TypeformRestClient(cfg,f as any);await c.request('GET','/forms/x/responses');expect(f).toHaveBeenCalledTimes(2);});
  it('does not blindly retry writes',async()=>{const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({message:'fail'}),{status:500}));const c=new TypeformRestClient(cfg,f as any);await expect(c.request('PUT','/forms/x/webhooks/a',{body:{url:'https://example.com'},retry:false})).rejects.toMatchObject({status:500});expect(f).toHaveBeenCalledTimes(1);});
});
