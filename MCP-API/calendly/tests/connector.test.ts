import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { loadConfig } from '../src/config.js';
import { approvalToken, assertApproved, TOOL_POLICY } from '../src/policy.js';
import { TOOL_DEFS } from '../src/tools.js';
import { CalendlyRestClient } from '../src/rest.js';

const baseEnv = {
  CALENDLY_API_TOKEN: 'test-token',
  CALENDLY_TRANSPORT: 'rest',
  CALENDLY_REQUIRE_WRITE_APPROVAL: 'true',
  CALENDLY_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef'
};

describe('config', () => {
  it('loads REST config without live credentials', () => {
    const cfg = loadConfig(baseEnv as any);
    expect(cfg.CALENDLY_TRANSPORT).toBe('rest');
    expect(cfg.CALENDLY_API_BASE_URL).toBe('https://api.calendly.com');
  });

  it('rejects MCP mode without MCP token', () => {
    expect(() => loadConfig({ ...baseEnv, CALENDLY_TRANSPORT: 'mcp', CALENDLY_MCP_ACCESS_TOKEN: undefined } as any)).toThrow(/MCP_ACCESS_TOKEN/);
  });
});

describe('tool registry and validation', () => {
  it('registers exactly the expected meaningful tools', () => {
    expect(TOOL_DEFS).toHaveLength(13);
    expect(new Set(TOOL_DEFS.map(t => t.name)).size).toBe(13);
    expect(TOOL_DEFS.some(t => t.name === 'calendly.event.cancel')).toBe(true);
  });

  it('rejects malformed booking email', () => {
    const tool = TOOL_DEFS.find(t => t.name === 'calendly.booking.create')!;
    expect(() => tool.schema.parse({ event_type: 'https://api.calendly.com/event_types/abc12345', start_time: '2026-08-26T10:00:00+07:00', invitee: { name: 'A', email: 'bad' } })).toThrow();
  });
});

describe('approval policy', () => {
  it('allows reads without approval', () => {
    const cfg = loadConfig(baseEnv as any);
    expect(() => assertApproved(cfg, 'calendly.event.get', { uuid: 'abc12345' })).not.toThrow();
  });

  it('requires exact approval for destructive operations', () => {
    const cfg = loadConfig(baseEnv as any);
    const args = { uuid: 'abc12345', reason: 'cancel' };
    expect(() => assertApproved(cfg, 'calendly.event.cancel', args)).toThrow(/approval/);
    const token = approvalToken(cfg.CALENDLY_APPROVAL_SECRET!, 'calendly.event.cancel', args);
    expect(() => assertApproved(cfg, 'calendly.event.cancel', args, token)).not.toThrow();
    expect(TOOL_POLICY['calendly.event.cancel'].risk).toBe('DESTRUCTIVE');
  });
});

describe('REST reliability', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => { globalThis.fetch = originalFetch; vi.restoreAllMocks(); });

  it('parses successful reads', async () => {
    globalThis.fetch = vi.fn(async () => new Response(JSON.stringify({ resource: { name: 'User' } }), { status: 200 })) as any;
    const client = new CalendlyRestClient(loadConfig(baseEnv as any));
    await expect(client.request('GET', '/users/me')).resolves.toEqual({ resource: { name: 'User' } });
  });

  it('does not retry non-retryable writes', async () => {
    const fn = vi.fn(async () => new Response(JSON.stringify({ message: 'busy' }), { status: 503 }));
    globalThis.fetch = fn as any;
    const client = new CalendlyRestClient(loadConfig(baseEnv as any));
    await expect(client.request('POST', '/invitees', { body: {}, retryable: false })).rejects.toThrow(/503/);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
