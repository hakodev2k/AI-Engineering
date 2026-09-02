import { describe,it,expect } from 'vitest';
import { authorize } from '../src/policy.js';
import type { Config } from '../src/config.js';
const cfg=(approved:string[]=[],require=true)=>({appApiKey:'x',region:'us',apiBaseUrl:'https://api.customer.io',mcpUrl:'https://mcp.customer.io/mcp',timeoutMs:1000,maxRetries:0,requireWriteApproval:require,approvedActions:new Set(approved)} as Config);
describe('policy',()=>{
  it('allows reads',()=>expect(()=>authorize(cfg(),'READ','x')).not.toThrow());
  it('blocks unapproved writes',()=>expect(()=>authorize(cfg(),'WRITE','x')).toThrow(/approval/i));
  it('always gates high risk unless exact action is approved',()=>{expect(()=>authorize(cfg([],false),'HIGH_RISK','send')).toThrow(/approval/i);expect(()=>authorize(cfg(['send'],false),'HIGH_RISK','send')).not.toThrow();});
});
