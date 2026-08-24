import { describe, expect, it, vi } from 'vitest';
import { SnowflakeManagedMcp } from '../src/managed-mcp.js';
import type { SnowflakeConfig } from '../src/config.js';

const config: SnowflakeConfig = {
  accountUrl: 'https://org-account.snowflakecomputing.com',
  token: 'rest-token',
  tokenType: 'OAUTH',
  allowedDatabases: new Set(),
  allowedSchemas: new Set(),
  timeoutMs: 1000,
  maxRetries: 0,
  mcpUrl: 'https://org-account.snowflakecomputing.com/api/v2/databases/DB/schemas/PUBLIC/mcp-servers/read-server',
  mcpAccessToken: 'mcp-oauth-token',
  mcpToolName: 'sql_exec_tool'
};

describe('official Snowflake managed MCP transport', () => {
  it('discovers the configured tool schema before invocation', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer mcp-oauth-token' });
      if (body.method === 'tools/list') {
        return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'sql_exec_tool', inputSchema: { type: 'object', properties: { query: { type: 'string' } } } }] } }), { status: 200 });
      }
      expect(body.method).toBe('tools/call');
      expect(body.params).toEqual({ name: 'sql_exec_tool', arguments: { query: 'SELECT 1' } });
      return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: { content: [{ type: 'text', text: '1' }] } }), { status: 200 });
    });
    const mcp = new SnowflakeManagedMcp(config, fetchMock as typeof fetch);
    const result = await mcp.executeRead('SELECT 1');
    expect(result).toMatchObject({ content: [{ type: 'text', text: '1' }] });
  });

  it('returns undefined when the expected tool is absent so REST fallback can run', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [] } }), { status: 200 }));
    const mcp = new SnowflakeManagedMcp(config, fetchMock as typeof fetch);
    await expect(mcp.executeRead('SELECT 1')).resolves.toBeUndefined();
  });

  it('rejects non-Snowflake MCP hosts', async () => {
    const bad = { ...config, mcpUrl: 'https://evil.example/mcp' };
    const mcp = new SnowflakeManagedMcp(bad, vi.fn() as unknown as typeof fetch);
    await expect(mcp.listTools()).rejects.toThrow(/Snowflake host/);
  });
});
