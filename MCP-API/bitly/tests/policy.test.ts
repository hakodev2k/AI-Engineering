import {describe,expect,it} from 'vitest';
import {authorize} from '../src/policy.js';
import {loadConfig} from '../src/config.js';

describe('configuration and approval policy',()=>{
  it('requires credentials and rejects unsafe API hosts',()=>{
    expect(()=>loadConfig({})).toThrow('BITLY_ACCESS_TOKEN');
    expect(()=>loadConfig({BITLY_ACCESS_TOKEN:'x',BITLY_API_BASE:'http://evil.test/v4'})).toThrow('api-ssl.bitly.com');
  });
  it('parses explicit policy settings',()=>{
    const c=loadConfig({BITLY_ACCESS_TOKEN:'x',BITLY_REQUIRE_WRITE_APPROVAL:'false',BITLY_DESTRUCTIVE_ENABLED:'true',BITLY_MAX_RETRIES:'3'});
    expect(c.requireWriteApproval).toBe(false);expect(c.destructiveEnabled).toBe(true);expect(c.maxRetries).toBe(3);
  });
  it('permits reads and gates mutations',()=>{
    expect(()=>authorize('READ',undefined,{requireWriteApproval:true,destructiveEnabled:false})).not.toThrow();
    expect(()=>authorize('WRITE',undefined,{requireWriteApproval:true,destructiveEnabled:false})).toThrow('approval');
    expect(()=>authorize('HIGH_RISK',undefined,{requireWriteApproval:false,destructiveEnabled:true})).toThrow('approval');
    expect(()=>authorize('DESTRUCTIVE',true,{requireWriteApproval:true,destructiveEnabled:false})).toThrow('disabled');
    expect(()=>authorize('DESTRUCTIVE',true,{requireWriteApproval:true,destructiveEnabled:true})).not.toThrow();
  });
});
