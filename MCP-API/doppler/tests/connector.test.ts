import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig, resolveScope } from '../src/config.js';
import { assertAllowed, TOOL_POLICY } from '../src/policy.js';
import { DopplerRestClient } from '../src/rest.js';

const baseEnv = { DOPPLER_TOKEN: 'dp.st.dev.' + 'a'.repeat(40), DOPPLER_READ_ONLY: 'true' };

describe('Doppler connector configuration and policy', () => {
  it('requires a recognized token and defaults to read-only', () => {
    const cfg = loadConfig(baseEnv);
    expect(cfg.readOnly).toBe(true);
    expect(cfg.apiBase).toBe('https://api.doppler.com/v3');
    expect(() => loadConfig({})).toThrow(/DOPPLER_TOKEN/);
    expect(() => loadConfig({ DOPPLER_TOKEN: 'bad' })).toThrow(/recognized/);
  });

  it('enforces configured project/config scope', () => {
    const cfg = loadConfig({ ...baseEnv, DOPPLER_PROJECT: 'app', DOPPLER_CONFIG: 'prd' });
    expect(resolveScope(cfg)).toEqual({ project: 'app', config: 'prd' });
    expect(() => resolveScope(cfg, 'other', 'prd')).toThrow(/outside configured connector scope/);
  });

  it('requires approval for sensitive reads', () => {
    const secret = 'approval-key';
    const cfg = loadConfig({ ...baseEnv, DOPPLER_APPROVAL_SECRET: secret });
    expect(() => assertAllowed(cfg, 'doppler.secret.get')).toThrow(/explicit approval/);
    const id = approvalDigest(secret, 'doppler.secret.get');
    expect(() => assertAllowed(cfg, 'doppler.secret.get', id)).not.toThrow();
  });

  it('denies writes in read-only mode', () => {
    const secret = 'approval-key';
    const cfg = loadConfig({ ...baseEnv, DOPPLER_APPROVAL_SECRET: secret });
    const id = approvalDigest(secret, 'doppler.secret.update');
    expect(() => assertAllowed(cfg, 'doppler.secret.update', id)).toThrow(/read-only/i);
  });

  it('catalogs exactly the implemented public tools', () => {
    expect(Object.keys(TOOL_POLICY).sort()).toEqual([
      'doppler.config.get', 'doppler.config.list', 'doppler.project.get', 'doppler.project.list',
      'doppler.secret.download', 'doppler.secret.get', 'doppler.secret.list', 'doppler.secret.names', 'doppler.secret.update'
    ].sort());
  });
});

describe('Doppler REST reliability', () => {
  it('sends bearer credentials only in the connector request layer', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => new Response(JSON.stringify({ projects: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    }));
    const cfg = loadConfig(baseEnv);
    const client = new DopplerRestClient(cfg, fetchMock as typeof fetch);
    await client.get('/projects');
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe(`Bearer ${cfg.token}`);
  });

  it('maps provider errors without leaking credentials', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ messages: ['denied'] }), { status: 403 }));
    const cfg = loadConfig(baseEnv);
    const client = new DopplerRestClient(cfg, fetchMock as typeof fetch);
    await expect(client.get('/projects')).rejects.toThrow(/Doppler API 403/);
    await expect(client.get('/projects')).rejects.not.toThrow(cfg.token);
  });
});
