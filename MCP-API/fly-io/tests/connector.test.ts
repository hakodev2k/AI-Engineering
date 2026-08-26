import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest, type Config } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { FlyClient, FlyApiError } from '../src/client.js';

const config: Config = {
  token: 'test-token', baseUrl: 'https://api.machines.dev/v1', orgSlug: 'personal',
  requireWriteApproval: true, approvalSecret: 'test-secret', timeoutMs: 2000
};

describe('configuration', () => {
  it('requires credentials', () => expect(() => loadConfig({})).toThrow(/FLY_API_TOKEN/));
  it('rejects arbitrary API origins', () => expect(() => loadConfig({FLY_API_TOKEN:'x', FLY_API_BASE_URL:'http://evil.test'})).toThrow(/official public HTTPS endpoint/));
});

describe('permission model', () => {
  it('registers read/write/high-risk/destructive policies', () => {
    expect(TOOL_POLICY['fly.app.list'].risk).toBe('READ');
    expect(TOOL_POLICY['fly.machine.start'].risk).toBe('HIGH_RISK');
    expect(TOOL_POLICY['fly.volume.delete'].risk).toBe('DESTRUCTIVE');
  });
  it('requires valid bound approval for write operations', () => {
    const payload = {app_name:'demo', org_slug:'personal'};
    expect(() => assertApproval(config,'fly.app.create',payload)).toThrow(/explicit approval/);
    const approval = approvalDigest('test-secret','fly.app.create',payload);
    expect(() => assertApproval(config,'fly.app.create',payload,approval)).not.toThrow();
    expect(() => assertApproval(config,'fly.app.create',{...payload, app_name:'other'},approval)).toThrow(/Invalid approval/);
  });
});

describe('FlyClient', () => {
  it('maps provider errors', async () => {
    const fake = vi.fn(async () => new Response('denied', {status:403}));
    const client = new FlyClient(config, fake as any);
    await expect(client.getApp('demo')).rejects.toMatchObject({status:403});
    expect(fake).toHaveBeenCalledTimes(1);
  });
  it('does not retry writes', async () => {
    const fake = vi.fn(async () => new Response('busy', {status:503}));
    const client = new FlyClient(config, fake as any);
    await expect(client.createApp({app_name:'demo',org_slug:'personal'})).rejects.toBeInstanceOf(FlyApiError);
    expect(fake).toHaveBeenCalledTimes(1);
  });
  it('retries transient read failures with a bound limit', async () => {
    let n = 0;
    const fake = vi.fn(async () => {
      n++; return n < 3 ? new Response('busy',{status:503}) : new Response(JSON.stringify({name:'demo'}),{status:200});
    });
    const client = new FlyClient(config, fake as any);
    await expect(client.getApp('demo')).resolves.toMatchObject({name:'demo'});
    expect(fake).toHaveBeenCalledTimes(3);
  });
});
