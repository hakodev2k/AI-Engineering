import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { ZendeskApiError, ZendeskClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const env = {
  ZENDESK_SUBDOMAIN: 'example',
  ZENDESK_OAUTH_ACCESS_TOKEN: 'test-oauth-token',
  ZENDESK_APPROVAL_MODE: 'required',
  ZENDESK_APPROVED_ACTIONS: 'zendesk.ticket.create',
  ZENDESK_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval', () => {
  it('requires subdomain and OAuth token', () => expect(() => loadConfig({})).toThrow());
  it('rejects unsafe subdomain values', () => expect(() => loadConfig({ ...env, ZENDESK_SUBDOMAIN: 'https://evil.test' })).toThrow());
  it('allows explicitly approved writes', () => expect(() => assertWriteAllowed(loadConfig(env), 'zendesk.ticket.create')).not.toThrow());
  it('denies unapproved writes', () => expect(() => assertWriteAllowed(loadConfig(env), 'zendesk.ticket.update')).toThrow(/APPROVAL_REQUIRED/));
  it('keeps destructive actions disabled by default', () => expect(() => assertWriteAllowed(loadConfig({ ...env, ZENDESK_APPROVED_ACTIONS:'zendesk.ticket.delete' }), 'zendesk.ticket.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/));
});

describe('ZendeskClient', () => {
  it('uses bearer auth and fixed account origin', async () => {
    const mockFetch = vi.fn(async (url: URL, init?: RequestInit) => {
      expect(url.origin).toBe('https://example.zendesk.com');
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-oauth-token' });
      return new Response(JSON.stringify({ tickets: [] }), { status: 200 });
    });
    const client = new ZendeskClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await client.request('/tickets.json');
  });
  it('does not retry authorization failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error:'Forbidden' }), { status:403 }));
    const client = new ZendeskClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/tickets.json')).rejects.toBeInstanceOf(ZendeskApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
  it('retries read throttling using Retry-After', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce(new Response('{}',{status:429,headers:{'Retry-After':'0'}})).mockResolvedValueOnce(new Response('{"tickets":[]}',{status:200}));
    const client = new ZendeskClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/tickets.json')).resolves.toEqual({ tickets:[] });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
  it('never automatically retries writes', async () => {
    const mockFetch = vi.fn(async () => new Response('{}',{status:429}));
    const client = new ZendeskClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/tickets.json',{method:'POST',body:{}})).rejects.toBeInstanceOf(ZendeskApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe('tool surface', () => {
  it('registers only scoped tools', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url),'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m=>m[1]);
    expect(names).toHaveLength(13);
    expect(names).toEqual(expect.arrayContaining(['zendesk.ticket.list','zendesk.ticket.search','zendesk.ticket.get','zendesk.ticket.create','zendesk.ticket.update','zendesk.ticket.comment.add','zendesk.ticket.delete','zendesk.user.list','zendesk.user.search','zendesk.user.get','zendesk.organization.list','zendesk.organization.get','zendesk.group.list']));
    expect(source).not.toContain('execute_any_api_request');
  });
});
