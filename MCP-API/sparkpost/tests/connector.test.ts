import { describe,it,expect,vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { SparkPostClient,SparkPostError } from '../src/client.js';
import { buildTools } from '../src/tools.js';
import { ApprovalError,safeWebhookTarget } from '../src/security.js';

const cfg=loadConfig({SPARKPOST_API_KEY:'test-key',SPARKPOST_REGION:'us',SPARKPOST_TIMEOUT_MS:'1000',SPARKPOST_WRITE_APPROVAL_REQUIRED:'true',SPARKPOST_DESTRUCTIVE_ENABLED:'false'} as any);
describe('config and tools',()=>{
 it('selects US endpoint and registers meaningful tools',()=>{expect(cfg.baseUrl).toContain('api.sparkpost.com');expect(buildTools({} as any,cfg).length).toBeGreaterThanOrEqual(15)});
 it('rejects missing credential',()=>expect(()=>loadConfig({} as any)).toThrow());
 it('validates webhook targets against SSRF-prone local hosts',()=>{expect(()=>safeWebhookTarget('http://localhost/x')).toThrow();expect(safeWebhookTarget('https://example.com/hook')).toContain('example.com')});
 it('requires approval for writes',async()=>{const fake={request:vi.fn()} as any;const tool=buildTools(fake,cfg).find(x=>x.name==='sparkpost.template.create')!;await expect(tool.run({id:'x',content:{html:'x'},approved:false})).rejects.toBeInstanceOf(ApprovalError)});
 it('keeps destructive operations disabled by default',async()=>{const fake={request:vi.fn()} as any;const tool=buildTools(fake,cfg).find(x=>x.name==='sparkpost.webhook.delete')!;await expect(tool.run({id:'1',approved:true})).rejects.toBeInstanceOf(ApprovalError)});
});
describe('client reliability',()=>{
 it('maps provider errors',async()=>{const f=vi.fn().mockResolvedValue(new Response('{"errors":[{"message":"bad"}]}',{status:400}));const c=new SparkPostClient(cfg,f as any);await expect(c.request('GET','/x')).rejects.toBeInstanceOf(SparkPostError)});
 it('retries throttled reads using retry-after',async()=>{const f=vi.fn().mockResolvedValueOnce(new Response('slow',{status:429,headers:{'retry-after':'0'}})).mockResolvedValueOnce(new Response('{"results":[]}',{status:200,headers:{'content-type':'application/json'}}));const c=new SparkPostClient(cfg,f as any);await expect(c.request('GET','/x')).resolves.toEqual({results:[]});expect(f).toHaveBeenCalledTimes(2)});
 it('does not retry unsafe write by default when disabled',async()=>{const f=vi.fn().mockResolvedValue(new Response('err',{status:500}));const c=new SparkPostClient(cfg,f as any);await expect(c.request('POST','/x',{}, {retry:false})).rejects.toBeInstanceOf(SparkPostError);expect(f).toHaveBeenCalledTimes(1)});
});
