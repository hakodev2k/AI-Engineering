import {describe,it,expect} from 'vitest';
import {approved,requireApproval,requireToken,TOOL_RISK,createServer} from '../src/index.js';

describe('security configuration',()=>{
  it('requires a server credential',()=>expect(()=>requireToken({})).toThrow('UPLOADTHING_TOKEN'));
  it('allows reads without approval',()=>expect(approved('uploadthing.file.list',{})).toBe(true));
  it('denies writes by default',()=>expect(()=>requireApproval('uploadthing.file.rename',{})).toThrow('APPROVAL_REQUIRED'));
  it('allows only explicitly approved writes',()=>expect(approved('uploadthing.file.rename',{UPLOADTHING_APPROVED_TOOLS:'uploadthing.file.rename'})).toBe(true));
  it('classifies deletion as destructive',()=>expect(TOOL_RISK['uploadthing.file.delete']).toBe('DESTRUCTIVE'));
});

describe('server',()=>{
  it('registers without live credentials when a client is injected',()=>{
    const fake={} as any;
    expect(createServer({},fake)).toBeTruthy();
  });
});
