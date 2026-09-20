import {describe,it,expect,vi,beforeEach} from 'vitest';
process.env.ELASTIC_CLOUD_API_KEY='test-key';
process.env.NODE_ENV='test';
const mod=await import('../src/server.js');

describe('Elastic Cloud connector',()=>{
 beforeEach(()=>vi.restoreAllMocks());
 it('sends isolated ApiKey authentication and returns JSON',async()=>{
  const f=vi.fn(async (_u:any,i:any)=>{expect(i.headers.Authorization).toBe('ApiKey test-key');return new Response('{"ok":true}',{status:200,headers:{'content-type':'application/json'}});}) as any;
  await expect(mod.request('/api/v1/deployments',{},f)).resolves.toEqual({ok:true});
 });
 it('rejects cross-origin/absolute paths',async()=>{await expect(mod.request('https://evil.example/x')).rejects.toThrow('relative API path required');});
 it('maps provider errors',async()=>{
  const f=vi.fn(async()=>new Response('{"message":"denied"}',{status:403})) as any;
  await expect(mod.request('/api/v1/deployments',{},f)).rejects.toMatchObject({status:403,message:'denied'});
 });
 it('retries bounded GET throttling',async()=>{
  const f=vi.fn().mockResolvedValueOnce(new Response('',{status:429,headers:{'retry-after':'0'}})).mockResolvedValueOnce(new Response('{"ok":1}',{status:200})) as any;
  await expect(mod.request('/api/v1/deployments',{},f)).resolves.toEqual({ok:1}); expect(f).toHaveBeenCalledTimes(2);
 });
 it('does not blindly retry writes',async()=>{
  const f=vi.fn(async()=>new Response('',{status:503})) as any;
  await expect(mod.request('/api/v1/deployments',{method:'POST',body:'{}'},f)).rejects.toMatchObject({status:503}); expect(f).toHaveBeenCalledTimes(1);
 });
 it('constructs MCP server and registers tools',()=>{expect(mod.createServer()).toBeTruthy();});
});
