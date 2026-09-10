import { afterEach, describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { ContentstackClient, ContentstackError } from '../src/client.js';
import { enforcePolicy, TOOL_RISK } from '../src/policy.js';
import { buildTools } from '../src/tools.js';

const saved = {...process.env};
afterEach(()=>{ process.env = {...saved}; vi.restoreAllMocks(); });

function configEnv(){
  process.env.CONTENTSTACK_API_KEY='blt_test';
  process.env.CONTENTSTACK_MANAGEMENT_TOKEN='token_test';
  process.env.CONTENTSTACK_REGION='aws-na';
  process.env.CONTENTSTACK_BRANCH='main';
}

describe('configuration and policy',()=>{
  it('requires credentials',()=>{
    delete process.env.CONTENTSTACK_API_KEY; delete process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
    expect(()=>loadConfig()).toThrow();
  });

  it('uses safe approval defaults',()=>{
    configEnv();
    const c=loadConfig();
    expect(c.requireWriteApproval).toBe(true);
    expect(c.enableDestructive).toBe(false);
    expect(c.baseUrl).toBe('https://api.contentstack.io/v3');
  });

  it('registers provider scoped risk classes',()=>{
    expect(Object.keys(TOOL_RISK)).toHaveLength(13);
    expect(Object.keys(TOOL_RISK).every(k=>k.startsWith('contentstack.'))).toBe(true);
    expect(TOOL_RISK['contentstack.entry.publish']).toBe('HIGH_RISK');
    expect(TOOL_RISK['contentstack.entry.delete']).toBe('DESTRUCTIVE');
  });

  it('binds approval to exact payload',()=>{
    configEnv(); process.env.CONTENTSTACK_APPROVAL_SECRET='0123456789abcdef';
    const c=loadConfig();
    const args:any={contentTypeUid:'page',entryUid:'e1',entry:{title:'A'}};
    args.approvalToken=approvalDigest(c.approvalSecret!,'contentstack.entry.update',args);
    expect(()=>enforcePolicy(c,'contentstack.entry.update',args)).not.toThrow();
    args.entry={title:'B'};
    expect(()=>enforcePolicy(c,'contentstack.entry.update',args)).toThrow(/approval/i);
  });

  it('keeps destructive tools disabled by default',()=>{
    configEnv(); process.env.CONTENTSTACK_APPROVAL_SECRET='0123456789abcdef';
    const c=loadConfig();
    expect(()=>enforcePolicy(c,'contentstack.entry.delete',{entryUid:'e1'})).toThrow(/disabled/i);
  });
});

describe('client reliability and credentials',()=>{
  it('sends credentials only in provider headers',async()=>{
    configEnv(); const c=loadConfig();
    const mock=vi.fn(async (_url:any, init:any)=>new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}}));
    const client=new ContentstackClient(c,mock as any);
    await client.request('GET','/content_types');
    const init=mock.mock.calls[0][1] as any;
    expect(init.headers.api_key).toBe('blt_test');
    expect(init.headers.authorization).toBe('token_test');
  });

  it('retries bounded read throttling',async()=>{
    configEnv(); process.env.CONTENTSTACK_MAX_RETRIES='1'; const c=loadConfig();
    const mock=vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({error_message:'slow'}),{status:429,headers:{'retry-after':'0'}}))
      .mockResolvedValueOnce(new Response(JSON.stringify({ok:true}),{status:200}));
    const client=new ContentstackClient(c,mock as any);
    await expect(client.request<any>('GET','/content_types')).resolves.toEqual({ok:true});
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('never retries writes blindly',async()=>{
    configEnv(); process.env.CONTENTSTACK_MAX_RETRIES='5'; const c=loadConfig();
    const mock=vi.fn(async()=>new Response(JSON.stringify({error_message:'busy'}),{status:503}));
    const client=new ContentstackClient(c,mock as any);
    await expect(client.request('POST','/content_types/page/entries',{body:{entry:{}},retryable:false})).rejects.toBeInstanceOf(ContentstackError);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('exposes strict validated tools',()=>{
    configEnv(); const c=loadConfig();
    const tools=buildTools(new ContentstackClient(c,vi.fn() as any),c);
    const get=tools.find(t=>t.name==='contentstack.entry.get')!;
    expect(()=>get.schema.parse({contentTypeUid:'page',entryUid:'entry',unexpected:true})).toThrow();
  });
});
