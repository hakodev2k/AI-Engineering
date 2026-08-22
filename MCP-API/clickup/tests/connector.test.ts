import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { ClickUpApiError, ClickUpClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  CLICKUP_ACCESS_TOKEN: 'pk_test_token',
  CLICKUP_APPROVAL_MODE: 'required',
  CLICKUP_APPROVED_ACTIONS: 'clickup.task.create,clickup.comment.create',
  CLICKUP_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('keeps personal tokens raw and wraps OAuth access tokens with Bearer', () => {
    expect(loadConfig(baseEnv).authorizationHeader).toBe('pk_test_token');
    expect(loadConfig({ ...baseEnv, CLICKUP_ACCESS_TOKEN: 'oauth_access_token' }).authorizationHeader).toBe('Bearer oauth_access_token');
  });
  it('allows an explicitly approved write', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'clickup.task.create')).not.toThrow();
  });
  it('denies an unapproved write', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'clickup.task.update')).toThrow(/APPROVAL_REQUIRED/);
  });
  it('keeps destructive operations disabled by default', () => {
    const config = loadConfig({ ...baseEnv, CLICKUP_APPROVED_ACTIONS: 'clickup.task.delete' });
    expect(() => assertWriteAllowed(config, 'clickup.task.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('ClickUpClient', () => {
  it('keeps the token only in the outbound Authorization header', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'pk_test_token' });
      return new Response(JSON.stringify({ user: { id: 1 } }), { status: 200 });
    });
    const client = new ClickUpClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/user')).resolves.toEqual({ user: { id: 1 } });
  });

  it('does not retry authorization errors', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ err: 'unauthorized' }), { status: 401 }));
    const client = new ClickUpClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/team')).rejects.toBeInstanceOf(ClickUpApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ err: 'busy' }), { status: 503 }));
    const client = new ClickUpClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/list/1/task', { method: 'POST', body: { name: 'x' } })).rejects.toBeInstanceOf(ClickUpApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries throttled reads with a bounded attempt count', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ err: 'rate limited' }), { status: 429, headers: { 'x-ratelimit-reset': String(nowSeconds) } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ teams: [] }), { status: 200 }));
    const client = new ClickUpClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/team')).resolves.toEqual({ teams: [] });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  it('registers the intended scoped tools without a raw request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'clickup.user.get', 'clickup.workspace.list', 'clickup.space.list', 'clickup.folder.list',
      'clickup.list.folderless.list', 'clickup.list.in_folder.list', 'clickup.task.list',
      'clickup.task.get', 'clickup.task.create', 'clickup.task.update', 'clickup.task.delete',
      'clickup.comment.list', 'clickup.comment.create'
    ]));
    expect(source).not.toContain('execute_any');
    expect(source).not.toContain('raw_request');
  });
});
