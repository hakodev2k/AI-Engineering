import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { IntercomApiError, IntercomClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  INTERCOM_ACCESS_TOKEN: 'test-token',
  INTERCOM_APPROVAL_MODE: 'required',
  INTERCOM_APPROVED_ACTIONS: 'intercom.contact.update',
  INTERCOM_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('rejects non-HTTPS API origins', () => expect(() => loadConfig({ ...baseEnv, INTERCOM_API_BASE_URL: 'http://localhost:8080' })).toThrow(/HTTPS/));
  it('allows an explicitly approved write', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'intercom.contact.update')).not.toThrow();
  });
  it('denies an unapproved write', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'intercom.conversation.reply')).toThrow(/APPROVAL_REQUIRED/);
  });
});

describe('IntercomClient', () => {
  it('keeps credentials in provider headers and pins the API version', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({
        Authorization: 'Bearer test-token',
        'Intercom-Version': '2.16'
      });
      return new Response(JSON.stringify({ type: 'admin', id: '1' }), { status: 200 });
    });
    const client = new IntercomClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/me')).resolves.toMatchObject({ type: 'admin' });
  });

  it('does not retry authorization failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ code: 'forbidden' }] }), { status: 403 }));
    const client = new IntercomClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/contacts')).rejects.toBeInstanceOf(IntercomApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('never retries writes automatically', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ code: 'server_error' }] }), { status: 503 }));
    const client = new IntercomClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/contacts/1', { method: 'PUT', body: { name: 'Alice' } })).rejects.toBeInstanceOf(IntercomApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling using Intercom rate-limit headers', async () => {
    const now = Math.floor(Date.now() / 1000);
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ errors: [{ code: 'rate_limit_exceeded' }] }), {
        status: 429, headers: { 'x-ratelimit-reset': String(now) }
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ type: 'list', conversations: [] }), { status: 200 }));
    const client = new IntercomClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/conversations')).resolves.toMatchObject({ type: 'list' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  it('registers only scoped provider tools and no arbitrary request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'intercom.admin.me', 'intercom.contact.search', 'intercom.contact.get', 'intercom.contact.update',
      'intercom.conversation.list', 'intercom.conversation.get', 'intercom.conversation.reply',
      'intercom.conversation.note.add', 'intercom.conversation.assign', 'intercom.conversation.close',
      'intercom.conversation.reopen', 'intercom.help_center.list', 'intercom.article.search'
    ]));
    expect(source).not.toContain('execute_any');
    expect(source).not.toContain('raw_request');
  });
});
