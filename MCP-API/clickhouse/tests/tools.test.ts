import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTools } from '../src/tools.js';

type Call = { kind:string; value:unknown };
class FakeClient {
  calls: Call[] = [];
  async queryJson(query:string){ this.calls.push({kind:'query',value:query}); return [{ok:1}]; }
  async exec(query:string){ this.calls.push({kind:'exec',value:query}); }
  async insert(table:string,rows:Record<string,unknown>[]){ this.calls.push({kind:'insert',value:{table,rows}}); }
}

const config = {
  url:'https://localhost:8443', username:'default', password:'', database:'default',
  requestTimeoutMs:30000, maxExecutionTimeSeconds:30, maxResultRows:1000,
  allowWrites:false, allowDestructive:false
};

test('registers ten provider-scoped tools with risks', () => {
  const tools = buildTools(new FakeClient() as never, config);
  assert.equal(tools.length, 10);
  assert.ok(tools.every(t => t.name.startsWith('clickhouse.')));
  assert.equal(tools.find(t=>t.name==='clickhouse.table.drop')?.risk,'DESTRUCTIVE');
});

test('sample query is bounded and validates identifiers', async () => {
  const fake = new FakeClient();
  const tool = buildTools(fake as never, config).find(t=>t.name==='clickhouse.table.sample')!;
  await tool.run({table:'events',limit:25});
  assert.match(String(fake.calls[0]?.value), /LIMIT 25$/);
  await assert.rejects(() => tool.run({table:'events;drop',limit:1}));
});

test('write requires approval and then uses insert transport', async () => {
  const fake = new FakeClient();
  const tool = buildTools(fake as never, config).find(t=>t.name==='clickhouse.table.insert')!;
  await assert.rejects(() => tool.run({table:'events',rows:[{id:1}]}), /WRITE_APPROVAL_REQUIRED/);
  await tool.run({table:'events',rows:[{id:1}],approved:true});
  assert.equal(fake.calls.at(-1)?.kind,'insert');
});

test('destructive tool is disabled by default', async () => {
  const fake = new FakeClient();
  const tool = buildTools(fake as never, config).find(t=>t.name==='clickhouse.table.truncate')!;
  await assert.rejects(() => tool.run({table:'events',approved:true}), /DESTRUCTIVE_DISABLED/);
});
