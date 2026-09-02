import { describe,it,expect } from 'vitest';
import { loadConfig } from '../src/config.js';
describe('config',()=>{
  it('requires an App API key',()=>expect(()=>loadConfig({} as any)).toThrow(/CUSTOMERIO_APP_API_KEY/));
  it('selects EU endpoints',()=>{const c=loadConfig({CUSTOMERIO_APP_API_KEY:'x',CUSTOMERIO_REGION:'eu'} as any);expect(c.apiBaseUrl).toBe('https://api-eu.customer.io');expect(c.mcpUrl).toContain('mcp-eu.customer.io');});
  it('parses action approvals',()=>{const c=loadConfig({CUSTOMERIO_APP_API_KEY:'x',CUSTOMERIO_APPROVED_ACTIONS:'a,b'} as any);expect(c.approvedActions.has('b')).toBe(true);});
});
