import { describe,it,expect } from 'vitest';
import { authorize } from '../src/policy.js';
import type { Config } from '../src/config.js';
const c=(approved:string[]=[],writes=true)=>({mcpToken:'m',apiToken:'r',apiBaseUrl:'https://api.typeform.com',mcpUrl:'https://api.typeform.com/mcp',timeoutMs:1000,maxRetries:0,requireWriteApproval:writes,approvedActions:new Set(approved)} as Config);
describe('policy',()=>{
  it('allows read',()=>expect(()=>authorize(c(),'READ','x')).not.toThrow());
  it('blocks unapproved writes',()=>expect(()=>authorize(c(),'WRITE','w')).toThrow(/approval/i));
  it('always gates high-risk publish',()=>expect(()=>authorize(c([],false),'HIGH_RISK','p')).toThrow(/approval/i));
  it('rejects destructive operations',()=>expect(()=>authorize(c(['d']),'DESTRUCTIVE','d')).toThrow(/disabled/i));
});
