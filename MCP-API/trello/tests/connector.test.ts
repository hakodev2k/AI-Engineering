import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { TrelloApiError, TrelloClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const env = {
  TRELLO_API_KEY: 'key-test',
  TRELLO_TOKEN: 'token-test',
  TRELLO_APPROVAL_MODE: 'required',
  TRELLO_APPROVED_ACTIONS: 'trello.card.create,trello.card.comment',
  TRELLO_ALLOW_ARCHIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows explicitly approved write', () => expect(() => assertWriteAllowed(loadConfig(env), 'trello.card.create')).not.toThrow());
  it('denies unapproved write', () => expect(() => assertWriteAllowed(loadConfig(env), 'trello.card.move')).toThrow(/APPROVAL_REQUIRED/));
  it('keeps archive disabled by default', () => {
    const c = loadConfig({ ...env, TRELLO_APPROVED_ACTIONS: 'trello.card.archive' });
    expect(() => assertWriteAllowed(c, 'trello.card.archive', true)).toThrow(/ARCHIVE_DISABLED/);
  });
});

describe('TrelloClient', () => {
  it('keeps credentials in connector-generated query parameters', async () => {
    const mockFetch = vi.fn(async (url: URL) => {
      expect(url.searchParams.get('key')).toBe('key-test');
      expect(url.searchParams.get('token')).toBe('token-test');
      return new Response(JSON.stringify({ id: 'me' }), { status: 200 });
    });
    const client = new TrelloClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/members/me')).resolves.toEqual({ id: 'me' });
  });

  it('does not retry authorization failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ message: 'unauthorized' }), { status: 401 }));
    const client = new TrelloClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/members/me')).rejects.toBeInstanceOf(TrelloApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ message: 'busy' }), { status: 503 }));
    const client = new TrelloClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/cards', { method: 'POST', query: { idList: 'L', name: 'N' } })).rejects.toBeInstanceOf(TrelloApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries throttled reads with a bound', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'API_TOKEN_LIMIT_EXCEEDED' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'B' }]), { status: 200 }));
    const client = new TrelloClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.request('/members/me/boards')).resolves.toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  it('registers only scoped tools', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m => m[1]);
    expect(names).toEqual(expect.arrayContaining([
      'trello.member.get', 'trello.board.list', 'trello.board.get', 'trello.board.create',
      'trello.list.list', 'trello.list.create', 'trello.card.search', 'trello.card.get',
      'trello.card.create', 'trello.card.update', 'trello.card.move', 'trello.card.comment',
      'trello.card.archive', 'trello.webhook.create'
    ]));
    expect(source).not.toContain('execute_any');
    expect(source).not.toContain('delete');
  });
});
