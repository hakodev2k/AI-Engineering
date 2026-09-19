import {describe,it,expect,beforeEach} from 'vitest';import {tools} from '../src/tools.js';import {cfg,approval,ApprovalError} from '../src/core.js';
beforeEach(()=>{process.env.PLAIN_API_KEY='plainApiKey_test';process.env.PLAIN_APPROVE_WRITES='false'});
describe('plain connector',()=>{
it('registers eight scoped tools',()=>expect(tools).toHaveLength(8));
it('requires API key',()=>{delete process.env.PLAIN_API_KEY;expect(()=>cfg()).toThrow()});
it('denies unapproved writes',()=>expect(()=>approval('WRITE')).toThrow(ApprovalError));
it('requires explicit destructive approval',()=>expect(()=>approval('DESTRUCTIVE')).toThrow(ApprovalError));
it('validates customer email',()=>expect(()=>tools[0].schema.parse({email:'bad',fullName:'A'})).toThrow());
it('requires literal approval for replies',()=>expect(()=>tools[2].schema.parse({threadId:'th_123',text:'Hi',approved:false})).toThrow());
it('requires destructive confirmation',()=>expect(()=>tools[7].schema.parse({customerId:'c_123',approved:true,confirmation:'delete'})).toThrow());
it('rejects ambiguous assignee before network',async()=>{process.env.PLAIN_APPROVE_WRITES='true';await expect(tools[3].run({threadId:'th_123',userId:'u_1',machineUserId:'mu_1'})).rejects.toThrow('exactly one')});
});
