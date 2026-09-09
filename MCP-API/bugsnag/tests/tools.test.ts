import test from 'node:test';
import assert from 'node:assert/strict';
import { toolSpecs } from '../src/tools.js';

test('registers a useful bounded BugSnag tool surface', () => {
  assert.ok(toolSpecs.length >= 8 && toolSpecs.length <= 20);
  assert.equal(new Set(toolSpecs.map(t => t.name)).size, toolSpecs.length);
  assert.ok(toolSpecs.every(t => t.name.startsWith('bugsnag.')));
});

test('destructive error states are not exposed', () => {
  const update = toolSpecs.find(t => t.name === 'bugsnag.error.update');
  assert.ok(update);
  const schema = update.schema.status;
  const status = schema as { safeParse: (value: unknown) => { success: boolean } };
  assert.equal(status.safeParse('discarded').success, false);
  assert.equal(status.safeParse('fixed').success, true);
});

test('mutating tools are classified WRITE and require configurable approval', () => {
  const writes = toolSpecs.filter(t => t.risk !== 'READ');
  assert.deepEqual(writes.map(t => t.name).sort(), ['bugsnag.error.update', 'bugsnag.performance.network_grouping.set']);
  assert.ok(writes.every(t => t.risk === 'WRITE' && t.approval === 'configurable'));
});

test('pagination URLs are constrained to valid URLs', () => {
  const list = toolSpecs.find(t => t.name === 'bugsnag.error.list');
  assert.ok(list);
  const next = list.schema.next_url as { safeParse: (value: unknown) => { success: boolean } };
  assert.equal(next.safeParse('not a url').success, false);
  assert.equal(next.safeParse('https://api.bugsnag.com/projects/x/errors?offset=10').success, true);
});
