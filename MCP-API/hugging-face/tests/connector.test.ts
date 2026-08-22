import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { HuggingFaceApiError, HuggingFaceClient } from '../src/client.js';
import { assertWriteAllowed, loadConfig } from '../src/config.js';

const baseEnv = {
  HF_TOKEN: 'hf_test_token',
  HF_APPROVAL_MODE: 'required',
  HF_APPROVED_ACTIONS: 'huggingface.inference.chat,huggingface.repo.create',
  HF_ALLOW_DESTRUCTIVE: 'false'
};

describe('configuration and approval policy', () => {
  it('rejects missing token', () => expect(() => loadConfig({})).toThrow());
  it('allows an approved write', () => expect(() => assertWriteAllowed(loadConfig(baseEnv), 'huggingface.repo.create')).not.toThrow());
  it('denies an unapproved write', () => expect(() => assertWriteAllowed(loadConfig(baseEnv), 'huggingface.repo.delete')).toThrow(/APPROVAL_REQUIRED/));
  it('keeps destructive actions disabled by default', () => {
    const config = loadConfig({ ...baseEnv, HF_APPROVED_ACTIONS: 'huggingface.repo.delete' });
    expect(() => assertWriteAllowed(config, 'huggingface.repo.delete', true)).toThrow(/DESTRUCTIVE_DISABLED/);
  });
});

describe('HuggingFaceClient', () => {
  it('keeps the token inside the Authorization header', async () => {
    const mockFetch = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer hf_test_token' });
      return new Response(JSON.stringify({ name: 'tester' }), { status: 200 });
    });
    const client = new HuggingFaceClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/whoami-v2')).resolves.toEqual({ name: 'tester' });
  });

  it('does not retry writes', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: 'busy' }), { status: 503 }));
    const client = new HuggingFaceClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/repos/create', { method: 'POST', body: {} })).rejects.toBeInstanceOf(HuggingFaceApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries a throttled read within the bounded policy', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'rate limited' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'a/b' }]), { status: 200 }));
    const client = new HuggingFaceClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/models')).resolves.toEqual([{ id: 'a/b' }]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('does not retry authorization errors', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 }));
    const client = new HuggingFaceClient(loadConfig(baseEnv), mockFetch as unknown as typeof fetch);
    await expect(client.request('/api/models')).rejects.toBeInstanceOf(HuggingFaceApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe('tool surface', () => {
  it('registers scoped tools without a generic request escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'huggingface.model.search', 'huggingface.model.get', 'huggingface.dataset.search', 'huggingface.dataset.get',
      'huggingface.space.search', 'huggingface.space.get', 'huggingface.repo.file.list', 'huggingface.user.whoami',
      'huggingface.inference.chat', 'huggingface.repo.create', 'huggingface.repo.delete'
    ]));
    expect(source).not.toContain('execute_any_api_request');
  });
});
