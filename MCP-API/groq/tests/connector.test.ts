import { describe, expect, it, vi } from 'vitest';
import { GroqClient, GroqApiError } from '../src/client.js';
import { assertModelAllowed, loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval, assertDestructiveEnabled } from '../src/policy.js';

function config(overrides: Record<string, string> = {}) {
  return loadConfig({ GROQ_API_KEY: 'test-key', GROQ_MAX_RETRIES: '0', ...overrides });
}

describe('configuration and policy', () => {
  it('requires an API key', () => expect(() => loadConfig({})).toThrow('GROQ_API_KEY'));

  it('enforces model allow-list', () => {
    const c = config({ GROQ_ALLOWED_MODELS: 'openai/gpt-oss-20b' });
    expect(() => assertModelAllowed(c, 'openai/gpt-oss-20b')).not.toThrow();
    expect(() => assertModelAllowed(c, 'other/model')).toThrow('allow-listed');
  });

  it('requires valid approval by default for write tools', () => {
    const c = config({ GROQ_APPROVAL_SECRET: 'secret' });
    expect(() => assertApproval('groq.chat.complete', undefined, c)).toThrow('Approval required');
    expect(() => assertApproval('groq.chat.complete', approvalDigest('secret', 'groq.chat.complete'), c)).not.toThrow();
  });

  it('can disable approval for ordinary writes but not always-required operations', () => {
    const c = config({ GROQ_REQUIRE_WRITE_APPROVAL: 'false' });
    expect(() => assertApproval('groq.chat.complete', undefined, c)).not.toThrow();
    expect(() => assertApproval('groq.batch.create', undefined, c, true)).toThrow('GROQ_APPROVAL_SECRET');
  });

  it('keeps destructive operations disabled by default', () => {
    expect(() => assertDestructiveEnabled(config())).toThrow('disabled');
    expect(() => assertDestructiveEnabled(config({ GROQ_ENABLE_DESTRUCTIVE: 'true' }))).not.toThrow();
  });
});

describe('HTTP client', () => {
  it('adds bearer auth and returns JSON', async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    const client = new GroqClient(config(), fetchMock as typeof fetch);
    await expect(client.get('/models')).resolves.toEqual({ data: [] });
  });

  it('maps provider errors without leaking the API key', async () => {
    const fetchMock = vi.fn(async () => new Response('{"error":"bad request"}', { status: 400 }));
    const client = new GroqClient(config(), fetchMock as typeof fetch);
    await expect(client.get('/models')).rejects.toBeInstanceOf(GroqApiError);
    await expect(client.get('/models')).rejects.not.toThrow('test-key');
  });

  it('does not retry billable POST requests', async () => {
    const fetchMock = vi.fn(async () => new Response('busy', { status: 500 }));
    const client = new GroqClient(config({ GROQ_MAX_RETRIES: '3' }), fetchMock as typeof fetch);
    await expect(client.post('/chat/completions', { model: 'x' })).rejects.toThrow('500');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
