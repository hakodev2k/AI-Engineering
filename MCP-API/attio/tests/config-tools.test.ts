import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { TOOL_MAP, TOOLS } from '../src/tools.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';

test('authentication configuration is required', () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /ATTIO_MCP_ACCESS_TOKEN/);
});

test('official MCP endpoint is pinned', () => {
  assert.throws(() => loadConfig({ ATTIO_MCP_ACCESS_TOKEN:'x', ATTIO_MCP_URL:'https://evil.example/mcp' } as NodeJS.ProcessEnv), /official/);
});

test('tool names are provider scoped and upstream calls are allowlisted', () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 22);
  for (const tool of TOOLS) {
    assert.match(tool.name, /^attio\./);
    assert.equal(TOOL_MAP.get(tool.name), tool);
    assert.ok(ALLOWED_UPSTREAM_TOOLS.has(tool.upstream), `${tool.upstream} must be allowlisted`);
  }
});

test('write schemas reject approval tokens with the wrong length', () => {
  const tool = TOOL_MAP.get('attio.record.update')!;
  const parsed = tool.schema.safeParse({ object:'companies', record_id:'abc', values:{name:'Acme'}, approvalId:'short' });
  assert.equal(parsed.success, false);
});

test('record list limits pagination to the MCP contract', () => {
  const tool = TOOL_MAP.get('attio.record.list')!;
  assert.equal(tool.schema.safeParse({ object:'companies', limit:51 }).success, false);
  assert.equal(tool.schema.safeParse({ object:'companies', limit:50 }).success, true);
});

test('email content requires both mailbox and email IDs', () => {
  const tool = TOOL_MAP.get('attio.email.get')!;
  assert.equal(tool.schema.safeParse({ email_id:'e1' }).success, false);
  assert.equal(tool.schema.safeParse({ mailbox_id:'m1', email_id:'e1' }).success, true);
});

test('meeting search requires a bounded time window and timezone', () => {
  const tool = TOOL_MAP.get('attio.meeting.search')!;
  assert.equal(tool.schema.safeParse({ starts_after:'2026-09-01T00:00:00Z' }).success, false);
  assert.equal(tool.schema.safeParse({ starts_after:'2026-09-01T00:00:00Z', starts_before:'2026-09-08T00:00:00Z', timezone:'Asia/Ho_Chi_Minh' }).success, true);
});
