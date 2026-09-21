import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
test('requires https, allowlist and approval secret',()=>{
 const c=loadConfig({ZAPIER_MCP_URL:'https://example.invalid/mcp',ZAPIER_MCP_ALLOWED_TOOLS:'find_contact,send_email',ZAPIER_APPROVAL_SECRET:'1234567890123456',ZAPIER_MCP_TIMEOUT_MS:'5000'});
 assert.equal(c.allowedTools.has('send_email'),true); assert.equal(c.timeoutMs,5000);
 assert.throws(()=>loadConfig({ZAPIER_MCP_URL:'http://example.invalid/mcp',ZAPIER_MCP_ALLOWED_TOOLS:'x',ZAPIER_APPROVAL_SECRET:'1234567890123456'}));
});
