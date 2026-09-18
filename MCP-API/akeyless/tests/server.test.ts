import {beforeEach,describe,expect,it,vi} from 'vitest';
import {AkeylessClient,ApprovalGate,ApprovalError,AkeylessError,safeName} from '../src/server.js';

beforeEach(()=>{process.env.AKEYLESS_ACCESS_ID='p-test';process.env.AKEYLESS_ACCESS_KEY='not-a-real-key';process.env.AKEYLESS_API_URL='https://api.akeyless.io';process.env.AKEYLESS_MAX_RETRIES='1';});
const response=(status:number,body:any,headers:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json',...headers}});

describe('validation and approval',()=>{
 it('accepts absolute paths and rejects ambiguous names',()=>{expect(safeName.parse('/prod/db')).toBe('/prod/db');expect(()=>safeName.parse('../prod')).toThrow()});
 it('requires configured approval for high-risk operations',()=>{const g=new ApprovalGate('approve-123');expect(()=>g.require('HIGH_RISK')).toThrow(ApprovalError);expect(()=>g.require('DESTRUCTIVE','wrong')).toThrow();expect(()=>g.require('HIGH_RISK','approve-123')).not.toThrow()});
});

describe('client',()=>{
 it('authenticates and lists without exposing configured access key in output',async()=>{const f=vi.fn().mockResolvedValueOnce(response(200,{token:'session-token'})).mockResolvedValueOnce(response(200,{items:[{item_name:'/prod/a'}]}));const c=new AkeylessClient(f as any);const x=await c.list('/prod');expect(x.items).toHaveLength(1);expect(JSON.stringify(x)).not.toContain('not-a-real-key');expect(f).toHaveBeenCalledTimes(2)});
 it('does not retry write operations',async()=>{const f=vi.fn().mockResolvedValueOnce(response(200,{token:'t'})).mockResolvedValueOnce(response(500,{message:'down'}));const c=new AkeylessClient(f as any);await expect(c.create('/x','y')).rejects.toBeInstanceOf(AkeylessError);expect(f).toHaveBeenCalledTimes(2)});
 it('retries bounded reads on throttling and honors recovery',async()=>{const f=vi.fn().mockResolvedValueOnce(response(200,{token:'t'})).mockResolvedValueOnce(response(429,{message:'slow'})).mockResolvedValueOnce(response(200,{items:[]}));const c=new AkeylessClient(f as any);await expect(c.list('/')).resolves.toEqual({items:[]});expect(f).toHaveBeenCalledTimes(3)});
 it('surfaces permission errors without retry',async()=>{const f=vi.fn().mockResolvedValueOnce(response(200,{token:'t'})).mockResolvedValueOnce(response(403,{message:'denied'}));const c=new AkeylessClient(f as any);await expect(c.list('/')).rejects.toMatchObject({status:403});expect(f).toHaveBeenCalledTimes(2)});
});
