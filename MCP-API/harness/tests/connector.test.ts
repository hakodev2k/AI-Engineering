import { describe,it,expect,vi,beforeEach,afterEach } from 'vitest';
import { loadConfig } from '../src/config.js';
import { requireWriteApproval } from '../src/policy.js';
import { HarnessClient } from '../src/client.js';

const base={HARNESS_ACCOUNT_ID:'acct',HARNESS_ORG_ID:'org',HARNESS_PROJECT_ID:'proj',HARNESS_BASE_URL:'https://app.harness.io',HARNESS_TIMEOUT_MS:'1000',HARNESS_MAX_RETRIES:'0',HARNESS_WRITE_APPROVED:'false'};
describe('Harness connector',()=>{
  beforeEach(()=>{process.env.HARNESS_API_KEY='test-token-value';}); afterEach(()=>{delete process.env.HARNESS_API_KEY;});
  it('loads safe scoped config',()=>{const c=loadConfig(base);expect(c.HARNESS_ACCOUNT_ID).toBe('acct');});
  it('rejects non-Harness base hosts',()=>{expect(()=>loadConfig({...base,HARNESS_BASE_URL:'https://example.com'})).toThrow();});
  it('requires human approval for writes',()=>{expect(()=>requireWriteApproval({...base})).toThrow(/Human approval/);expect(()=>requireWriteApproval({...base,HARNESS_WRITE_APPROVED:'true'})).not.toThrow();});
  it('maps read request and keeps credential in transport',async()=>{const f=vi.fn(async (_u:any,i:any)=>new Response(JSON.stringify({status:'SUCCESS'}),{status:200,headers:{'content-type':'application/json'}}));const c=new HarnessClient(loadConfig(base),f as any);await c.request('/ng/api/user-groups');expect(f).toHaveBeenCalledOnce();expect((f.mock.calls[0]![1] as any).headers['x-api-key']).toBe('test-token-value');});
  it('does not retry validation/auth errors',async()=>{const f=vi.fn(async()=>new Response('denied',{status:403}));const c=new HarnessClient(loadConfig({...base,HARNESS_MAX_RETRIES:'2'}),f as any);await expect(c.request('/ng/api/user-groups')).rejects.toThrow(/403/);expect(f).toHaveBeenCalledTimes(1);});
  it('retries throttling only within bound',async()=>{const f=vi.fn().mockResolvedValueOnce(new Response('slow',{status:429})).mockResolvedValueOnce(new Response('{}',{status:200,headers:{'content-type':'application/json'}}));const c=new HarnessClient(loadConfig({...base,HARNESS_MAX_RETRIES:'1'}),f as any);await c.request('/ng/api/user-groups');expect(f).toHaveBeenCalledTimes(2);});
});
