import {describe,it,expect,vi,beforeEach} from 'vitest';
import {TelnyxClient} from '../src/client.js';
import {executeTool,tools} from '../src/tools.js';
import {ApprovalError} from '../src/security.js';

describe('telnyx connector',()=>{
 beforeEach(()=>{process.env.TELNYX_API_KEY='test-key';process.env.TELNYX_WRITE_APPROVAL_REQUIRED='true';vi.restoreAllMocks()});
 it('registers ten scoped tools',()=>expect(tools).toHaveLength(10));
 it('rejects invalid E.164',async()=>{await expect(executeTool('telnyx.message.send',{from:'123',to:'+15551234567',text:'x',approved:true})).rejects.toBeTruthy()});
 it('requires approval for external message',async()=>{await expect(executeTool('telnyx.message.send',{from:'+15551234567',to:'+15557654321',text:'x'})).rejects.toBeInstanceOf(ApprovalError)});
 it('maps successful reads',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({data:{id:'x'}}),{status:200})));const c=new TelnyxClient({key:'k'});expect((await c.request('GET','/messages/x')).data.id).toBe('x')});
 it('does not retry auth failure',async()=>{const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({errors:[{detail:'bad key'}]}),{status:401}));vi.stubGlobal('fetch',f);await expect(new TelnyxClient({key:'k'}).request('GET','/messages/x')).rejects.toMatchObject({status:401});expect(f).toHaveBeenCalledTimes(1)});
 it('retries throttling and preserves retry metadata on final failure',async()=>{const f=vi.fn().mockResolvedValue(new Response('{}',{status:429,headers:{'retry-after':'0'}}));vi.stubGlobal('fetch',f);await expect(new TelnyxClient({key:'k'}).request('GET','/messages/x')).rejects.toMatchObject({status:429});expect(f).toHaveBeenCalledTimes(3)});
 it('validates provider-relative paths',async()=>{await expect(new TelnyxClient({key:'k'}).request('GET','https://evil.test')).rejects.toBeTruthy()});
});
