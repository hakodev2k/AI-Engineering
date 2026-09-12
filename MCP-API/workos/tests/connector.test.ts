import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { WorkOSClient, WorkOSError } from '../src/client.js';
import { requireApproval } from '../src/policy.js';
import { registerTools } from '../src/tools.js';

const base = { WORKOS_API_KEY:'sk_test', WORKOS_API_BASE_URL:'https://api.workos.com', WORKOS_TIMEOUT_MS:'1000', WORKOS_MAX_RETRIES:'0' };

test('auth configuration requires API key and HTTPS', () => {
  assert.throws(() => loadConfig({}), /WORKOS_API_KEY/);
  assert.throws(() => loadConfig({ ...base, WORKOS_API_BASE_URL:'http://example.com' }), /https/);
  assert.equal(loadConfig(base).apiKey, 'sk_test');
});

test('tool registration exposes exactly ten scoped tools', () => {
  const names:string[] = [];
  const fakeServer = { tool: (name:string) => { names.push(name); } } as any;
  registerTools(fakeServer, {} as any, loadConfig(base));
  assert.equal(names.length, 10);
  assert.ok(names.includes('workos.organization.list'));
  assert.ok(names.includes('workos.audit_event.create'));
  assert.ok(!names.some(n => n.includes('raw') || n.includes('request')));
});

test('read request sends bearer token and bounded query', async () => {
  let seen:RequestInfo|URL|undefined; let auth='';
  const mockFetch:any = async (input:any, init:any) => { seen=input; auth=init.headers.Authorization; return new Response(JSON.stringify({object:'list',data:[]}), {status:200}); };
  const api = new WorkOSClient(loadConfig(base), mockFetch);
  const out:any = await api.get('/organizations', {limit:20, search:'acme'});
  assert.equal(out.object, 'list');
  assert.equal(auth, 'Bearer sk_test');
  assert.match(String(seen), /limit=20/);
});

test('permission denial blocks writes without explicit human gate', () => {
  assert.throws(() => requireApproval(loadConfig(base), 'WRITE'), /Human approval/);
  assert.doesNotThrow(() => requireApproval(loadConfig({...base, WORKOS_WRITE_APPROVED:'true'}), 'WRITE'));
});

test('API errors map status without retrying permission failures', async () => {
  let calls=0;
  const mockFetch:any = async () => { calls++; return new Response(JSON.stringify({message:'forbidden'}), {status:403}); };
  const api = new WorkOSClient(loadConfig({...base, WORKOS_MAX_RETRIES:'2'}), mockFetch);
  await assert.rejects(() => api.get('/organizations'), (e:any) => e instanceof WorkOSError && e.status === 403);
  assert.equal(calls, 1);
});

test('429 honors bounded retry path', async () => {
  let calls=0;
  const mockFetch:any = async () => { calls++; return calls === 1 ? new Response(JSON.stringify({message:'slow'}), {status:429, headers:{'retry-after':'0'}}) : new Response(JSON.stringify({ok:true}), {status:200}); };
  const api = new WorkOSClient(loadConfig({...base, WORKOS_MAX_RETRIES:'1'}), mockFetch);
  assert.deepEqual(await api.get('/events'), {ok:true});
  assert.equal(calls, 2);
});

test('POST is not blindly retried on provider 5xx', async () => {
  let calls=0;
  const mockFetch:any = async () => { calls++; return new Response(JSON.stringify({message:'failed'}), {status:500}); };
  const api = new WorkOSClient(loadConfig({...base, WORKOS_MAX_RETRIES:'2'}), mockFetch);
  await assert.rejects(() => api.post('/audit_logs/events', {x:1}));
  assert.equal(calls, 1);
});
