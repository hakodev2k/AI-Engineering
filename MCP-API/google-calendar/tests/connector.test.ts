import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval, TOOL_META } from '../src/policy.js';
import { GoogleTokenProvider } from '../src/auth.js';
import { GoogleCalendarUpstream } from '../src/upstream.js';

const baseEnv = {
  GOOGLE_ACCESS_TOKEN: 'test-access-token',
  GOOGLE_CALENDAR_MCP_URL: 'https://calendarmcp.googleapis.com/mcp/v1',
  GOOGLE_CALENDAR_API_BASE_URL: 'https://www.googleapis.com/calendar/v3',
  GOOGLE_OAUTH_TOKEN_URL: 'https://oauth2.googleapis.com/token',
  GOOGLE_CALENDAR_TIMEOUT_MS: '5000',
  GOOGLE_CALENDAR_MAX_RETRIES: '2'
};

test('configuration requires credentials and pins official upstream hosts', () => {
  assert.throws(() => loadConfig({}), /Configure GOOGLE_ACCESS_TOKEN/);
  assert.throws(() => loadConfig({ ...baseEnv, GOOGLE_CALENDAR_MCP_URL: 'https://evil.example/mcp' }), /unexpected upstream host/);
  assert.equal(loadConfig(baseEnv).maxRetries, 2);
});

test('tool inventory has meaningful read/write/high-risk/destructive classifications', () => {
  assert.equal(TOOL_META.length, 11);
  assert.ok(TOOL_META.some(([, risk]) => risk === 'READ'));
  assert.ok(TOOL_META.some(([, risk]) => risk === 'WRITE'));
  assert.ok(TOOL_META.some(([, risk]) => risk === 'HIGH_RISK'));
  assert.ok(TOOL_META.some(([, risk]) => risk === 'DESTRUCTIVE'));
});

test('approval is action and resource scoped', () => {
  const secret = 'x'.repeat(32);
  const token = approvalDigest(secret, 'google_calendar.event.delete', 'primary/event-1');
  assert.doesNotThrow(() => assertApproval('google_calendar.event.delete', 'primary/event-1', token, secret));
  assert.throws(() => assertApproval('google_calendar.event.delete', 'primary/event-2', token, secret), /Invalid approval/);
  assert.throws(() => assertApproval('google_calendar.event.delete', 'primary/event-1', undefined, secret), /Explicit approval/);
});

test('OAuth refresh token is isolated and cached', async () => {
  let calls = 0;
  const fetchImpl: typeof fetch = async (_url, init) => {
    calls++;
    assert.equal(init?.method, 'POST');
    assert.match(String(init?.body), /grant_type=refresh_token/);
    return new Response(JSON.stringify({ access_token: 'fresh-token', expires_in: 3600 }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const config = loadConfig({ GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: 'secret', GOOGLE_REFRESH_TOKEN: 'refresh' });
  const provider = new GoogleTokenProvider(config, fetchImpl);
  assert.equal(await provider.getToken(), 'fresh-token');
  assert.equal(await provider.getToken(), 'fresh-token');
  assert.equal(calls, 1);
});

test('MCP read retries throttling with bounded retry and parses JSON response', async () => {
  const config = loadConfig(baseEnv);
  let calls = 0;
  const fetchImpl: typeof fetch = async (_url, init) => {
    calls++;
    assert.equal((init?.headers as Record<string, string>).authorization, 'Bearer test-access-token');
    if (calls === 1) return new Response('busy', { status: 429, headers: { 'retry-after': '0' } });
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: { structuredContent: { calendars: [] } } }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const provider = new GoogleTokenProvider(config, fetchImpl);
  const upstream = new GoogleCalendarUpstream(config, provider, fetchImpl, async () => {});
  const value = await upstream.mcp('list_calendars', { pageSize: 10 });
  assert.deepEqual(value, { structuredContent: { calendars: [] } });
  assert.equal(calls, 2);
});

test('writes are not blindly retried', async () => {
  const config = loadConfig(baseEnv);
  let calls = 0;
  const fetchImpl: typeof fetch = async () => { calls++; return new Response('busy', { status: 503 }); };
  const provider = new GoogleTokenProvider(config, fetchImpl);
  const upstream = new GoogleCalendarUpstream(config, provider, fetchImpl, async () => {});
  await assert.rejects(() => upstream.mcp('create_event', { summary: 'x' }, false), /MCP error 503/);
  assert.equal(calls, 1);
});

test('REST fallback encodes pagination and retries only safe reads', async () => {
  const config = loadConfig(baseEnv);
  let seen = '';
  const fetchImpl: typeof fetch = async (url) => {
    seen = String(url);
    return new Response(JSON.stringify({ items: [], nextPageToken: 'next' }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const provider = new GoogleTokenProvider(config, fetchImpl);
  const upstream = new GoogleCalendarUpstream(config, provider, fetchImpl);
  await upstream.rest('GET', '/calendars/primary/events/abc/instances', { maxResults: 25, pageToken: 'p 1' });
  assert.match(seen, /maxResults=25/);
  assert.match(seen, /pageToken=p\+1/);
});
