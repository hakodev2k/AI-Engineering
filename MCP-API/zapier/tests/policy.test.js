import test from 'node:test';
import assert from 'node:assert/strict';
import { classify, approvalToken, authorize } from '../src/policy.js';

test('classifies read/write/destructive tools',()=>{
 assert.equal(classify({name:'find_contact',description:'Find a contact'}),'READ');
 assert.equal(classify({name:'send_email',description:'Send email'}),'WRITE');
 assert.equal(classify({name:'delete_record',description:'Delete record'}),'DESTRUCTIVE');
});
test('write requires argument-bound approval',()=>{
 const secret='1234567890123456', args={to:'a@example.com'};
 assert.throws(()=>authorize({secret,toolName:'send_email',args,risk:'WRITE'}),/approval/);
 const token=approvalToken(secret,'send_email',args);
 assert.doesNotThrow(()=>authorize({secret,toolName:'send_email',args,suppliedToken:token,risk:'WRITE'}));
 assert.throws(()=>authorize({secret,toolName:'send_email',args:{to:'b@example.com'},suppliedToken:token,risk:'WRITE'}),/approval/);
});
test('destructive is disabled even with approval',()=>assert.throws(()=>authorize({secret:'1234567890123456',toolName:'delete',args:{},suppliedToken:'x',risk:'DESTRUCTIVE'}),/disabled/));
