import test from 'node:test';
import assert from 'node:assert/strict';
import { expectedApproval, assertAllowed } from '../src/policy.js';
import type { AttioConfig } from '../src/config.js';

const base: AttioConfig = {
  mcpUrl: new URL('https://mcp.attio.com/mcp'),
  accessToken: 'test-token',
  permissions: new Set(['read','write']),
  requireWriteApproval: true,
  approvalSecret: 'unit-test-secret',
  timeoutMs: 20000
};

test('READ tool runs with read permission', () => {
  assert.doesNotThrow(() => assertAllowed('READ','attio.record.search',{query:'Acme'},base));
});

test('WRITE tool requires approval', () => {
  assert.throws(() => assertAllowed('WRITE','attio.record.update',{record_id:'r1'},base), /approval/i);
});

test('WRITE approval is bound to tool and arguments', () => {
  const args: Record<string, unknown> = { record_id:'r1', values:{name:'A'} };
  args.approvalId = expectedApproval('attio.record.update', args, base.approvalSecret!);
  assert.doesNotThrow(() => assertAllowed('WRITE','attio.record.update',args,base));
  assert.throws(() => assertAllowed('WRITE','attio.record.update',{...args,record_id:'r2'},base), /approval/i);
});

test('destructive permission is denied unless explicitly granted', () => {
  assert.throws(() => assertAllowed('DESTRUCTIVE','attio.comment.delete',{approvalId:'x'.repeat(64)},base), /DESTRUCTIVE/);
});
