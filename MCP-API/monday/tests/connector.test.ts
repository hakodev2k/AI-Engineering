import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { assertWriteAllowed, loadConfig } from '../src/config.js';
import { MondayGraphqlClient, MondayGraphqlError } from '../src/graphql-client.js';

const baseEnv = {
  MONDAY_API_TOKEN: 'test-token',
  MONDAY_APPROVAL_MODE: 'required',
  MONDAY_APPROVED_ACTIONS: 'monday.item.create,monday.webhook.create',
  MONDAY_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows explicitly approved writes', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'monday.item.create')).not.toThrow();
  });
  it('denies unapproved writes', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'monday.update.create')).toThrow(/APPROVAL_REQUIRED/);
  });
  it('keeps destructive actions disabled by default', () => {
    const config = loadConfig({ ...baseEnv, MONDAY_APPROVED_ACTIONS: 'monday.webhook.delete' });
    expect(() => assertWriteAllowed(config, 'monday.webhook.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('MondayGraphqlClient', () => {
  it('keeps the token in the Authorization header and sends the configured API version', async () => {
    const mockFetch = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'test-token', 'API-Version': '2026-07' });
      return new Response(JSON.stringify({ data: { webhooks: [] } }), { status: 200 });
    });
    const client = new MondayGraphqlClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.execute<{ webhooks: unknown[] }>('query { webhooks(board_id: 1) { id } }', {})).resolves.toEqual({ webhooks: [] });
  });

  it('does not retry mutations', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'busy' }] }), { status: 503 }));
    const client = new MondayGraphqlClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.execute('mutation { x }', {}, true)).rejects.toBeInstanceOf(MondayGraphqlError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded read throttling', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ errors: [{ message: 'rate', extensions: { code: 'RATE_LIMIT', retry_in_seconds: 0 } }] }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { webhooks: [{ id: '1' }] } }), { status: 200 }));
    const client = new MondayGraphqlClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    const result = await client.execute<{ webhooks: Array<{ id: string }> }>('query { webhooks(board_id: 1) { id } }', {});
    expect(result.webhooks[0].id).toBe('1');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('maps GraphQL errors without retrying ordinary authorization failures', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'Not authorized', extensions: { code: 'FORBIDDEN' } }] }), { status: 200 }));
    const client = new MondayGraphqlClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.execute('query { webhooks(board_id: 1) { id } }', {})).rejects.toBeInstanceOf(MondayGraphqlError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe('tool surface and security boundaries', () => {
  it('registers scoped tools and no arbitrary API request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'monday.connection.validate', 'monday.user.context.get', 'monday.workspace.list',
      'monday.board.get', 'monday.board.items.list', 'monday.item.create',
      'monday.item.columns.update', 'monday.update.list', 'monday.update.create',
      'monday.webhook.list', 'monday.webhook.create', 'monday.webhook.delete'
    ]));
    expect(source).not.toContain('execute_any_api_request');
    expect(source).not.toContain('all_monday_api');
  });

  it('keeps the upstream MCP allowlist explicit', () => {
    const source = readFileSync(new URL('../src/mcp-client.ts', import.meta.url), 'utf8');
    expect(source).toContain('ALLOWED_UPSTREAM_TOOLS');
    expect(source).toContain('UPSTREAM_TOOL_NOT_ALLOWED');
    expect(source).not.toContain("callTool({ name: args");
  });
});
