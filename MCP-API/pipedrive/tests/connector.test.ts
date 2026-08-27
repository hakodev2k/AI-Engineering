import { describe,it,expect,vi } from 'vitest';
import { loadConfig,approvalDigest } from '../src/config.js';
import { assertApproval,TOOL_POLICY } from '../src/policy.js';
import { PipedriveClient } from '../src/client.js';

describe('configuration',()=>{
 it('requires credential for selected auth mode',()=>{expect(()=>loadConfig({PIPEDRIVE_AUTH_MODE:'api_token'} as any)).toThrow(/API_TOKEN/);});
 it('rejects non-HTTPS API base URL',()=>{expect(()=>loadConfig({PIPEDRIVE_AUTH_MODE:'api_token',PIPEDRIVE_API_TOKEN:'x',PIPEDRIVE_API_BASE_URL:'http://evil.test'} as any)).toThrow(/HTTPS/);});
});
describe('permission model',()=>{
 it('classifies destructive webhook deletion',()=>expect(TOOL_POLICY['pipedrive.webhook.delete']).toEqual({risk:'DESTRUCTIVE',approval:true}));
 it('binds approval to exact tool and payload',()=>{const secret='s';const input={id:7};const token=approvalDigest(secret,'pipedrive.webhook.delete',input);expect(()=>assertApproval('pipedrive.webhook.delete',{...input,approvalId:token},token,secret)).not.toThrow();expect(()=>assertApproval('pipedrive.webhook.delete',{id:8,approvalId:token},token,secret)).toThrow(/Invalid approval/);});
});
describe('client',()=>{
 it('keeps API token inside transport and never returns it',async()=>{const fetchMock=vi.fn(async(url:URL)=>new Response(JSON.stringify({success:true,data:{id:1}}),{status:200,headers:{'content-type':'application/json'}}));const c=new PipedriveClient(loadConfig({PIPEDRIVE_AUTH_MODE:'api_token',PIPEDRIVE_API_TOKEN:'secret'} as any),fetchMock as any);const r:any=await c.get('/v1/deals/1');expect(r.data.id).toBe(1);const u=new URL(fetchMock.mock.calls[0][0] as any);expect(u.searchParams.get('api_token')).toBe('secret');expect(JSON.stringify(r)).not.toContain('secret');});
 it('sends OAuth token as bearer header',async()=>{const fetchMock=vi.fn(async()=>new Response('{}',{status:200}));const c=new PipedriveClient(loadConfig({PIPEDRIVE_AUTH_MODE:'oauth2',PIPEDRIVE_ACCESS_TOKEN:'bearer'} as any),fetchMock as any);await c.get('/v1/deals/1');expect((fetchMock.mock.calls[0][1] as any).headers.authorization).toBe('Bearer bearer');});
 it('does not retry write failures',async()=>{const fetchMock=vi.fn(async()=>new Response(JSON.stringify({error:'busy'}),{status:503}));const c=new PipedriveClient(loadConfig({PIPEDRIVE_AUTH_MODE:'api_token',PIPEDRIVE_API_TOKEN:'x',PIPEDRIVE_MAX_RETRIES:'4'} as any),fetchMock as any);await expect(c.post('/v1/deals',{title:'x'})).rejects.toThrow();expect(fetchMock).toHaveBeenCalledTimes(1);});
 it('retries bounded read throttling',async()=>{let n=0;const fetchMock=vi.fn(async()=>{n++;return n===1?new Response('{}',{status:429,headers:{'retry-after':'0'}}):new Response(JSON.stringify({success:true}),{status:200});});const c=new PipedriveClient(loadConfig({PIPEDRIVE_AUTH_MODE:'api_token',PIPEDRIVE_API_TOKEN:'x',PIPEDRIVE_MAX_RETRIES:'2'} as any),fetchMock as any);await c.get('/v1/deals/1');expect(fetchMock).toHaveBeenCalledTimes(2);});
});
