import { describe,it,expect } from 'vitest'; import { loadConfig } from '../src/config.js';
describe('config',()=>{it('requires token',()=>expect(()=>loadConfig({} as any)).toThrow(/GITBOOK_TOKEN/));it('parses approval allowlist',()=>{const c=loadConfig({GITBOOK_TOKEN:'x',GITBOOK_APPROVED_ACTIONS:'a,b'} as any);expect(c.approvedActions.has('b')).toBe(true);});});
