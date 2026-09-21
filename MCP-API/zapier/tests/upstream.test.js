import test from 'node:test';
import assert from 'node:assert/strict';
import { ZapierUpstream } from '../src/upstream.js';
test('rejects non-allowlisted tools before network access',async()=>{
 const u=new ZapierUpstream({endpoint:'https://example.invalid/mcp',allowedTools:new Set(['safe'])});
 await assert.rejects(()=>u.callTool('unknown',{}),/not allowlisted/);
});
