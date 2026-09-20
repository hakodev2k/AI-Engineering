import {describe,it,expect,vi,beforeEach} from 'vitest';
import {SemaphoreClient,SemaphoreError,assertApproval} from '../src/index.js';
const env={SEMAPHORE_BASE_URL:'https://acme.semaphoreci.com',SEMAPHORE_API_TOKEN:'secret',SEMAPHORE_TIMEOUT_MS:'50',SEMAPHORE_MAX_RETRIES:'1'} as any;
describe('config and safety',()=>{
 it('rejects missing credentials',()=>expect(()=>new SemaphoreClient({})).toThrow());
 it('rejects non-https base',()=>expect(()=>new SemaphoreClient({...env,SEMAPHORE_BASE_URL:'http://x.test'})).toThrow());
 it('requires high-risk approval',()=>expect(()=>assertApproval('HIGH_RISK',false,env)).toThrow(/approval/));
 it('allows approved high-risk',()=>expect(()=>assertApproval('HIGH_RISK',true,env)).not.toThrow());
 it('disables destructive operations',()=>expect(()=>assertApproval('DESTRUCTIVE',true,env)).toThrow(/disabled/));
});
describe('client',()=>{beforeEach(()=>vi.restoreAllMocks());
 it('adds isolated token and parses response',async()=>{const f=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response(JSON.stringify([{id:'p'}]),{status:200}));const c=new SemaphoreClient(env);expect(await c.request('/projects')).toEqual([{id:'p'}]);expect((f.mock.calls[0][1]!.headers as any).Authorization).toBe('Token secret');});
 it('maps auth errors without retry',async()=>{const f=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('bad token',{status:401}));await expect(new SemaphoreClient(env).request('/projects')).rejects.toMatchObject({status:401});expect(f).toHaveBeenCalledTimes(1);});
 it('retries throttling once',async()=>{const f=vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(new Response('slow',{status:429})).mockResolvedValueOnce(new Response('{}',{status:200}));await new SemaphoreClient(env).request('/projects');expect(f).toHaveBeenCalledTimes(2);});
 it('does not retry non-idempotent execution when disabled',async()=>{const f=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('down',{status:503}));await expect(new SemaphoreClient(env).request('/plumber-workflows',{method:'POST'},false)).rejects.toBeInstanceOf(SemaphoreError);expect(f).toHaveBeenCalledTimes(1);});
});
