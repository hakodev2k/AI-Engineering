import { describe,it,expect } from 'vitest';
import { loadConfig } from '../src/config.js';
describe('config',()=>{
  it('requires both MCP OAuth and REST credentials',()=>expect(()=>loadConfig({} as any)).toThrow(/TYPEFORM_MCP_ACCESS_TOKEN/));
  it('parses approvals',()=>{const c=loadConfig({TYPEFORM_MCP_ACCESS_TOKEN:'m',TYPEFORM_API_TOKEN:'r',TYPEFORM_APPROVED_ACTIONS:'a,b'} as any);expect(c.approvedActions.has('b')).toBe(true);});
});
