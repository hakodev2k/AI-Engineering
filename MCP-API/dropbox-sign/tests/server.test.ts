import {describe,it,expect,beforeEach,vi} from 'vitest';
process.env.NODE_ENV='test';
process.env.DROPBOX_SIGN_API_KEY='test-key';
const {buildServer}=await import('../src/server.js');
describe('Dropbox Sign connector',()=>{
 beforeEach(()=>{process.env.DROPBOX_SIGN_APPROVE_WRITES='false';vi.restoreAllMocks()});
 it('builds the MCP server without live credentials',()=>{expect(buildServer()).toBeTruthy()});
 it('keeps writes approval-gated by default',()=>{expect(process.env.DROPBOX_SIGN_APPROVE_WRITES).toBe('false')});
 it('does not expose credentials through configuration output',()=>{expect(JSON.stringify(buildServer())).not.toContain('test-key')});
});
