import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { AsanaApiError, AsanaClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  ASANA_ACCESS_TOKEN: 'test-token',
  ASANA_APPROVAL_MODE: 'required',
  ASANA_APPROVED_ACTIONS: 'asana.task.create',
  ASANA_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approvals', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows approved writes', () => expect(() => assertWriteAllowed(loadConfig(baseEnv), 'asana.task.create')).not.toThrow());
  it('denies unapproved writes', () => expect(() => assertWriteAllowed(loadConfig(baseEnv), 'asana.task.update')).toThrow(/APPROVAL_REQUIRED/));
});

describe('AsanaClient', () => {
  it('keeps the bearer token inside the HTTP layer', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-token' });
      return new Response(JSON.stringify({ data: { gid: '1' } }), { status: 200 });
    });
    const client = new AsanaClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/users/me')).resolves.toEqual({ data: { gid: '1' } });
  });

  it('does not retry authorization failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'Forbidden' }] }), { status: 403 }));
    const client = new AsanaClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/tasks/1')).rejects.toBeInstanceOf(AsanaApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'Busy' }] }), { status: 503 }));
    const client = new AsanaClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/tasks', { method: 'POST', body: { data: {} } })).rejects.toBeInstanceOf(AsanaApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling and honors retry-after', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ errors: [{ message: 'Rate limited' }] }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    const client = new AsanaClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/workspaces')).resolves.toEqual({ data: [] });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  it('registers scoped tools and no generic request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'asana.user.me', 'asana.workspace.list', 'asana.project.list', 'asana.project.get',
      'asana.task.list', 'asana.task.search', 'asana.task.get', 'asana.task.create',
      'asana.task.update', 'asana.task.complete', 'asana.task.add_project',
      'asana.comment.list', 'asana.comment.create'
    ]));
    expect(source).not.toContain('execute_any');
  });
});
