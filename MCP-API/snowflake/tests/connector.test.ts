import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { SnowflakeClient, SnowflakeApiError, inferBinding, quoteIdentifier } from '../src/client.js';
import { assertDatabaseAllowed, assertSchemaAllowed, loadConfig, type SnowflakeConfig } from '../src/config.js';
import { approvalDigest, assertApproval } from '../src/policy.js';
import { TOOL_POLICY } from '../src/tool-policy.js';

const baseConfig: SnowflakeConfig = {
  accountUrl: 'https://org-account.snowflakecomputing.com',
  token: 'secret-test-token',
  tokenType: 'OAUTH',
  warehouse: 'WH',
  database: 'DB',
  schema: 'PUBLIC',
  role: 'READER',
  allowedDatabases: new Set(),
  allowedSchemas: new Set(),
  timeoutMs: 1000,
  maxRetries: 1,
  mcpToolName: 'sql_exec_tool'
};

describe('configuration and policy', () => {
  it('requires a Snowflake HTTPS account URL and token', () => {
    expect(() => loadConfig({})).toThrow(/ACCOUNT_URL/);
    expect(() => loadConfig({ SNOWFLAKE_ACCOUNT_URL: 'http://x.example.com', SNOWFLAKE_TOKEN: 'x' })).toThrow(/https/);
    expect(() => loadConfig({ SNOWFLAKE_ACCOUNT_URL: 'https://example.com', SNOWFLAKE_TOKEN: 'x' })).toThrow(/Snowflake account host/);
  });

  it('enforces database and schema allowlists', () => {
    const c = { ...baseConfig, allowedDatabases: new Set(['APP']), allowedSchemas: new Set(['APP.PUBLIC']) };
    expect(() => assertDatabaseAllowed(c, 'APP')).not.toThrow();
    expect(() => assertDatabaseAllowed(c, 'OTHER')).toThrow(/not allowed/);
    expect(() => assertSchemaAllowed(c, 'APP', 'PUBLIC')).not.toThrow();
    expect(() => assertSchemaAllowed(c, 'APP', 'PRIVATE')).toThrow(/not allowed/);
  });

  it('requires a tool-bound approval token for writes/high-risk actions', () => {
    const secret = 'approval-secret';
    const token = approvalDigest(secret, 'snowflake.row.insert');
    expect(() => assertApproval('snowflake.row.insert', token, secret)).not.toThrow();
    expect(() => assertApproval('snowflake.query.cancel', token, secret)).toThrow(/Invalid approval/);
    expect(() => assertApproval('snowflake.row.insert', undefined, secret)).toThrow(/explicit approval/);
  });
});

describe('validation helpers', () => {
  it('quotes only constrained Snowflake identifiers', () => {
    expect(quoteIdentifier('MY_TABLE')).toBe('"MY_TABLE"');
    expect(() => quoteIdentifier('x; DROP TABLE y')).toThrow(/Unsafe/);
  });

  it('maps primitive insert values to SQL API binding types', () => {
    expect(inferBinding(7)).toEqual({ type: 'FIXED', value: '7' });
    expect(inferBinding(1.5)).toEqual({ type: 'REAL', value: '1.5' });
    expect(inferBinding(true)).toEqual({ type: 'BOOLEAN', value: 'true' });
    expect(inferBinding('x')).toEqual({ type: 'TEXT', value: 'x' });
  });
});

describe('SQL API client', () => {
  it('executes a read operation without exposing the token in the body', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer secret-test-token' });
      expect(String(init?.body)).not.toContain('secret-test-token');
      return new Response(JSON.stringify({ data: [['ok']], statementHandle: '11111111-1111-4111-8111-111111111111' }), { status: 200 });
    });
    const client = new SnowflakeClient(baseConfig, fetchMock as typeof fetch);
    const result = await client.execute('SELECT 1', {}, undefined, false, true);
    expect(result.data[0][0]).toBe('ok');
  });

  it('maps provider errors and does not retry permission failures', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ code: '090105', sqlState: '42501', message: 'insufficient privileges' }), { status: 403 }));
    const client = new SnowflakeClient(baseConfig, fetchMock as typeof fetch);
    await expect(client.execute('SELECT 1', {}, undefined, false, true)).rejects.toBeInstanceOf(SnowflakeApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries a throttled read with bounded backoff', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'too many requests' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [['ok']] }), { status: 200 }));
    const client = new SnowflakeClient(baseConfig, fetchMock as typeof fetch);
    const result = await client.status('11111111-1111-4111-8111-111111111111');
    expect(result.data[0][0]).toBe('ok');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry cancel operations blindly', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ message: 'temporary failure' }), { status: 503 }));
    const client = new SnowflakeClient(baseConfig, fetchMock as typeof fetch);
    await expect(client.cancel('11111111-1111-4111-8111-111111111111')).rejects.toBeInstanceOf(SnowflakeApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('tool registration quality gate', () => {
  it('registers every policy-defined tool in the server', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const source = readFileSync(resolve(here, '../src/server.ts'), 'utf8');
    for (const name of Object.keys(TOOL_POLICY)) expect(source).toContain(`server.tool('${name}'`);
    expect(Object.keys(TOOL_POLICY)).toHaveLength(11);
  });
});
