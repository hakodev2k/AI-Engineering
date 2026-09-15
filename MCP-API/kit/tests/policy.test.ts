import { describe,it,expect } from 'vitest';
import { requireApproval,TOOL_POLICY } from '../src/policy.js';

describe('Kit connector policy',()=>{
  it('registers stable provider-scoped contracts',()=>expect(Object.keys(TOOL_POLICY)).toContain('kit.broadcast.stats'));
  it('allows reads without approval',()=>expect(()=>requireApproval('READ')).not.toThrow());
  it('denies destructive actions without approval',()=>expect(()=>requireApproval('DESTRUCTIVE')).toThrow(/APPROVAL_REQUIRED/));
  it('accepts explicit destructive approval',()=>expect(()=>requireApproval('DESTRUCTIVE',{approved:true,approvalToken:'confirmed-by-human'})).not.toThrow());
  it('can configure normal writes for host-managed approval',()=>expect(()=>requireApproval('WRITE',{},'host')).not.toThrow());
});
