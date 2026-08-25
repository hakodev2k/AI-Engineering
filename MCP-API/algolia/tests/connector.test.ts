import { describe, expect, it, vi } from 'vitest';
import { approvalToken, loadConfig } from '../src/config.js';
import { assertApproval, POLICY } from '../src/policy.js';
import { AlgoliaRest } from '../src/rest.js';

describe('config and permissions', () => {
  it('requires application id', () => expect(() => loadConfig({})).toThrow(/APPLICATION_ID/));
  it('classifies destructive delete', () => expect(POLICY['algolia.record.delete']).toEqual({ risk: 'DESTRUCTIVE', approval: true }));
  it('accepts payload-bound approval and rejects changed payload', () => {
    const secret = 'secret'; const payload = { index: 'products', objectID: '1' };
    const token = approvalToken(secret, 'algolia.record.delete', payload);
    expect(() => assertApproval('algolia.record.delete', payload, token, secret)).not.toThrow();
    expect(() => assertApproval('algolia.record.delete', { ...payload, objectID: '2' }, token, secret)).toThrow(/Invalid approval/);
  });
});

describe('rest reliability', () => {
  const cfg = loadConfig({ ALGOLIA_APPLICATION_ID:'APP', ALGOLIA_SEARCH_API_KEY:'search', ALGOLIA_ADMIN_API_KEY:'admin', ALGOLIA_TIMEOUT_MS:'1000', ALGOLIA_MAX_RETRIES:'1' });
  it('uses search key for search', async () => {
    const fn = vi.fn(async (_u: any, init: any) => new Response(JSON.stringify({ hits:[{objectID:'1'}] }), {status:200}));
    const api = new AlgoliaRest(cfg, fn as any); const r = await api.search('products', {query:'shoe'});
    expect(r.hits[0].objectID).toBe('1'); expect(fn.mock.calls[0][1].headers['x-algolia-api-key']).toBe('search');
  });
  it('retries 429 once for safe reads', async () => {
    const fn = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({message:'rate'}), {status:429, headers:{'retry-after':'0'}})).mockResolvedValueOnce(new Response(JSON.stringify({hits:[]}), {status:200}));
    const api = new AlgoliaRest(cfg, fn as any); await api.search('products', {query:''}); expect(fn).toHaveBeenCalledTimes(2);
  });
  it('does not blindly retry delete', async () => {
    const fn = vi.fn(async () => new Response(JSON.stringify({message:'busy'}), {status:503}));
    const api = new AlgoliaRest(cfg, fn as any); await expect(api.deleteRecord('products','1')).rejects.toThrow(); expect(fn).toHaveBeenCalledTimes(1);
  });
});
