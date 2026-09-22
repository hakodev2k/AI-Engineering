import { describe, expect, it, vi } from 'vitest';
import { PostmarkAuth } from '../src/auth.js';
import { PostmarkClient, PostmarkError } from '../src/client.js';
import { ApprovalError } from '../src/security.js';
import { createTools } from '../src/tools.js';

const auth = new PostmarkAuth('test-token');
const find = (tools: ReturnType<typeof createTools>, name: string) => tools.find(t=>t.name===name)!;

describe('Postmark connector', () => {
  it('rejects missing credentials', () => expect(()=>new PostmarkAuth('')).toThrow());
  it('isolates credential in request headers', () => expect(auth.headers()['X-Postmark-Server-Token']).toBe('test-token'));
  it('registers 15 scoped tools', () => { const c = new PostmarkClient(auth,{fetchImpl:vi.fn() as any}); expect(createTools(c)).toHaveLength(15); });
  it('rejects invalid input before API call', async () => { const f=vi.fn(); const t=find(createTools(new PostmarkClient(auth,{fetchImpl:f as any})),'postmark.message.outbound.get'); await expect(t.run({messageId:''})).rejects.toThrow(); expect(f).not.toHaveBeenCalled(); });
  it('requires approval for external email', async () => { const t=find(createTools(new PostmarkClient(auth,{fetchImpl:vi.fn() as any})),'postmark.message.send'); await expect(t.run({from:'a@example.com',to:'b@example.com',subject:'x',textBody:'y'})).rejects.toBeInstanceOf(ApprovalError); });
  it('executes approved write', async () => { const f=vi.fn(async()=>new Response(JSON.stringify({MessageID:'m1'}),{status:200})); const t=find(createTools(new PostmarkClient(auth,{fetchImpl:f as any})),'postmark.message.send'); const r:any=await t.run({from:'a@example.com',to:'b@example.com',subject:'x',textBody:'y',approved:true}); expect(r.MessageID).toBe('m1'); expect(f).toHaveBeenCalledOnce(); });
  it('executes read without approval', async () => { const f=vi.fn(async()=>new Response(JSON.stringify({TotalCount:0,Messages:[]}),{status:200})); const t=find(createTools(new PostmarkClient(auth,{fetchImpl:f as any})),'postmark.message.outbound.list'); await t.run({}); expect(f).toHaveBeenCalledOnce(); });
  it('retries GET on 429 and honors bounded retries', async () => { const f=vi.fn().mockResolvedValueOnce(new Response('{}',{status:429,headers:{'retry-after':'0'}})).mockResolvedValueOnce(new Response('{"ok":true}',{status:200})); const c=new PostmarkClient(auth,{fetchImpl:f as any,maxRetries:1}); await expect(c.request('GET','/bounces')).resolves.toEqual({ok:true}); expect(f).toHaveBeenCalledTimes(2); });
  it('does not retry writes', async () => { const f=vi.fn(async()=>new Response('{"Message":"busy"}',{status:500})); const c=new PostmarkClient(auth,{fetchImpl:f as any,maxRetries:2}); await expect(c.request('POST','/email',{})).rejects.toBeInstanceOf(PostmarkError); expect(f).toHaveBeenCalledOnce(); });
  it('maps invalid credentials without retry', async () => { const f=vi.fn(async()=>new Response('{"Message":"Unauthorized"}',{status:401})); const c=new PostmarkClient(auth,{fetchImpl:f as any,maxRetries:2}); await expect(c.request('GET','/bounces')).rejects.toMatchObject({status:401}); expect(f).toHaveBeenCalledOnce(); });
  it('bounds pagination inputs', async () => { const t=find(createTools(new PostmarkClient(auth,{fetchImpl:vi.fn() as any})),'postmark.bounce.list'); await expect(t.run({count:501,offset:0})).rejects.toThrow(); });
  it('reports timeout', async () => { const f=vi.fn((_u:any,o:any)=>new Promise((_r,reject)=>o.signal.addEventListener('abort',()=>reject(new Error('aborted'))))); const c=new PostmarkClient(auth,{fetchImpl:f as any,timeoutMs:5,maxRetries:0}); await expect(c.request('GET','/bounces')).rejects.toMatchObject({status:408}); });
});
