import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { ShopifyApiError, ShopifyClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const env = {
  SHOPIFY_SHOP_DOMAIN: 'example.myshopify.com',
  SHOPIFY_ADMIN_ACCESS_TOKEN: 'shpat_test',
  SHOPIFY_API_VERSION: '2026-07',
  SHOPIFY_APPROVAL_MODE: 'required',
  SHOPIFY_APPROVED_ACTIONS: 'shopify.product.create',
  SHOPIFY_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approvals', () => {
  it('rejects invalid shop domains', () => expect(() => loadConfig({ ...env, SHOPIFY_SHOP_DOMAIN: 'https://evil.example' })).toThrow());
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow());
  it('allows an approved write', () => expect(() => assertWriteAllowed(loadConfig(env), 'shopify.product.create')).not.toThrow());
  it('denies an unapproved write', () => expect(() => assertWriteAllowed(loadConfig(env), 'shopify.product.update')).toThrow(/APPROVAL_REQUIRED/));
  it('keeps destructive tools disabled by default', () => expect(() => assertWriteAllowed(loadConfig({ ...env, SHOPIFY_APPROVED_ACTIONS: 'shopify.product.delete' }), 'shopify.product.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/));
});

describe('ShopifyClient', () => {
  it('isolates credentials in the Shopify header', async () => {
    const mockFetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      expect(String(url)).toContain('example.myshopify.com/admin/api/2026-07/graphql.json');
      expect(init?.headers).toMatchObject({ 'X-Shopify-Access-Token': 'shpat_test' });
      return new Response(JSON.stringify({ data: { shop: { id: 'gid://shopify/Shop/1' } } }), { status: 200 });
    });
    const client = new ShopifyClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.graphql('query { shop { id } }')).resolves.toEqual({ shop: { id: 'gid://shopify/Shop/1' } });
  });

  it('does not retry mutations', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'Throttled' }] }), { status: 200 }));
    const client = new ShopifyClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await expect(client.graphql('mutation { x }', {}, true)).rejects.toBeInstanceOf(ShopifyApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries bounded HTTP throttling for reads', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ errors: [{ message: 'throttle' }] }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { shop: { id: 'gid://shopify/Shop/1' } } }), { status: 200 }));
    const client = new ShopifyClient(loadConfig(env), mockFetch as unknown as typeof fetch);
    await client.graphql('query { shop { id } }');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('tool surface', () => {
  it('registers scoped tools and no arbitrary GraphQL escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m => m[1]);
    expect(names).toEqual(expect.arrayContaining([
      'shopify.access_scope.list','shopify.shop.get','shopify.product.list','shopify.product.get',
      'shopify.product.create','shopify.product.update','shopify.product.delete','shopify.order.list',
      'shopify.order.get','shopify.location.list','shopify.inventory_level.list','shopify.webhook.list',
      'shopify.webhook.create','shopify.webhook.delete'
    ]));
    expect(source).not.toContain('execute_any');
    expect(source).not.toContain('raw_graphql');
  });
});
