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
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 25);
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

test('record list limits pagination', () => {
  const tool = TOOL_MAP.get('attio.record.list')!;
  assert.equal(tool.schema.safeParse({ object:'companies', limit:101 }).success, false);
  assert.equal(tool.schema.safeParse({ object:'companies', limit:100 }).success, true);
});
