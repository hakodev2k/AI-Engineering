import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { NewRelicApiError, NewRelicClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const env = {
  NEW_RELIC_USER_API_KEY: 'NRAK-test',
  NEW_RELIC_REGION: 'US',
  NEW_RELIC_APPROVAL_MODE: 'required',
  NEW_RELIC_APPROVED_ACTIONS: 'newrelic.alert.policy.create',
  NEW_RELIC_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('selects the configured regional endpoint', () => expect(loadConfig({ ...env, NEW_RELIC_REGION: 'EU' }).endpoint).toContain('api.eu.newrelic.com'));
  it('allows only an explicitly approved write', () => expect(() => assertWriteAllowed(loadConfig(env), 'newrelic.alert.policy.create')).not.toThrow());
  it('denies unapproved writes', () => expect(() => assertWriteAllowed(loadConfig(env), 'newrelic.alert.policy.update')).toThrow(/APPROVAL_REQUIRED/));
  it('keeps destructive operations disabled by default', () => expect(() => assertWriteAllowed(loadConfig({ ...env, NEW_RELIC_APPROVED_ACTIONS: 'newrelic.alert.policy.delete' }), 'newrelic.alert.policy.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/));
});

describe('NewRelicClient', () => {
  it('keeps the user key in the API-Key header', async () => {
    const f = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ 'API-Key': 'NRAK-test' });
      return new Response(JSON.stringify({ data: { actor: { accounts: [] } } }), { status: 200 });
    });
    const client = new NewRelicClient(loadConfig(env), f as unknown as typeof fetch);
    await expect(client.query('query { actor { accounts { id } } }')).resolves.toBeTruthy();
  });

  it('maps GraphQL errors', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'Forbidden' }] }), { status: 200 }));
    const client = new NewRelicClient(loadConfig(env), f as unknown as typeof fetch);
    await expect(client.query('query { actor { accounts { id } } }')).rejects.toBeInstanceOf(NewRelicApiError);
  });

  it('does not retry mutations', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ error: 'busy' }), { status: 503 }));
    const client = new NewRelicClient(loadConfig(env), f as unknown as typeof fetch);
    await expect(client.query('mutation { x }', {}, true)).rejects.toBeInstanceOf(NewRelicApiError);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('retries read throttling with a bounded attempt count', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { actor: { accounts: [] } } }), { status: 200 }));
    const client = new NewRelicClient(loadConfig(env), f as unknown as typeof fetch);
    await client.query('query { actor { accounts { id } } }');
    expect(f).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  it('registers scoped tools without a generic GraphQL escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m => m[1]);
    expect(names).toEqual(expect.arrayContaining([
      'newrelic.account.list','newrelic.entity.search','newrelic.entity.get','newrelic.entity.related.list',
      'newrelic.entity.tag.search','newrelic.entity.non_reporting.list','newrelic.nrql.query',
      'newrelic.alert.policy.list','newrelic.alert.policy.get','newrelic.alert.policy.create',
      'newrelic.alert.policy.update','newrelic.alert.policy.delete'
    ]));
    expect(source).not.toContain('execute_any');
    expect(source).not.toContain('graphql.execute');
  });
});
