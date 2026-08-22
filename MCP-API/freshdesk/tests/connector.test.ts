import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { FreshdeskApiError, FreshdeskClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  FRESHDESK_DOMAIN: 'example-helpdesk',
  FRESHDESK_API_KEY: 'test-api-key-12345',
  FRESHDESK_APPROVAL_MODE: 'required',
  FRESHDESK_APPROVED_ACTIONS: 'freshdesk.ticket.create'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('rejects domain injection', () => expect(() => loadConfig({ ...baseEnv, FRESHDESK_DOMAIN: 'evil.example.com' })).toThrow());
  it('allows an approved write', () => expect(() => assertWriteAllowed(loadConfig(baseEnv), 'freshdesk.ticket.create')).not.toThrow());
  it('denies an unapproved write', () => expect(() => assertWriteAllowed(loadConfig(baseEnv), 'freshdesk.ticket.reply')).toThrow(/APPROVAL_REQUIRED/));
});

describe('FreshdeskClient', () => {
  it('uses a fixed Freshdesk host and Basic API-key auth', async () => {
    const mockFetch = vi.fn(async (url: URL, init?: RequestInit) => {
      expect(url.toString()).toBe('https://example-helpdesk.freshdesk.com/api/v2/account');
      const expected = `Basic ${Buffer.from('test-api-key-12345:X').toString('base64')}`;
      expect(init?.headers).toMatchObject({ Authorization: expected });
      return new Response(JSON.stringify({ name: 'Example' }), { status: 200 });
    });
    const client = new FreshdeskClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/account')).resolves.toEqual({ name: 'Example' });
  });

  it('does not retry writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ description: 'busy' }), { status: 503 }));
    const client = new FreshdeskClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/tickets', { method: 'POST', body: {} })).rejects.toBeInstanceOf(FreshdeskApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling and honors Retry-After', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ description: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 1 }]), { status: 200 }));
    const client = new FreshdeskClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/tickets')).resolves.toEqual([{ id: 1 }]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('does not retry authorization failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ description: 'Forbidden' }), { status: 403 }));
    const client = new FreshdeskClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/tickets')).rejects.toBeInstanceOf(FreshdeskApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe('tool surface', () => {
  it('registers scoped tools and no arbitrary request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'freshdesk.account.get', 'freshdesk.ticket.list', 'freshdesk.ticket.get', 'freshdesk.ticket.search',
      'freshdesk.ticket.create', 'freshdesk.ticket.update', 'freshdesk.conversation.list', 'freshdesk.ticket.reply',
      'freshdesk.ticket.note.create', 'freshdesk.contact.list', 'freshdesk.contact.get', 'freshdesk.contact.search',
      'freshdesk.contact.create', 'freshdesk.contact.update', 'freshdesk.agent.list', 'freshdesk.group.list'
    ]));
    expect(source).not.toContain('execute_any');
    expect(source).not.toContain('raw_request');
  });
});
