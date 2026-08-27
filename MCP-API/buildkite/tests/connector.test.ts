import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertApproval, TOOL_POLICY, intentFor } from '../src/policy.js';
import { BuildkiteClient, BuildkiteError } from '../src/client.js';
import { createServer } from '../src/server.js';

describe('configuration', () => {
  it('requires credentials and pins official hosts', () => {
    expect(() => loadConfig({})).toThrow(/BUILDKITE_API_TOKEN/);
    expect(() => loadConfig({ BUILDKITE_API_TOKEN: 'x', BUILDKITE_API_BASE_URL: 'https://evil.example/v2' })).toThrow(/api\.buildkite\.com/);
    const cfg = loadConfig({ BUILDKITE_API_TOKEN: 'x' });
    expect(cfg.mcpUrl).toBe('https://mcp.buildkite.com/direct');
    expect(cfg.apiBaseUrl).toBe('https://api.buildkite.com/v2');
  });
});

describe('approval policy', () => {
  it('allows reads without approval', () => {
    expect(() => assertApproval('buildkite.build.get', { org_slug: 'o' }, undefined, undefined)).not.toThrow();
  });

  it('requires exact HMAC approval for writes', () => {
    const tool = 'buildkite.build.create';
    const args = { org_slug: 'o', pipeline_slug: 'p', commit: 'HEAD', branch: 'main' };
    const secret = 'test-secret';
    expect(() => assertApproval(tool, args, undefined, secret)).toThrow(/explicit human approval/);
    const approval = approvalDigest(secret, tool, intentFor(args));
    expect(() => assertApproval(tool, args, approval, secret)).not.toThrow();
  });

  it('classifies destructive artifact deletion', () => {
    expect(TOOL_POLICY['buildkite.artifact.delete']).toEqual(expect.objectContaining({ risk: 'DESTRUCTIVE', approvalRequired: true }));
  });
});

describe('REST reliability', () => {
  it('retries throttled reads but not mutations', async () => {
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(new Response('{"message":"slow down"}', { status: 429, headers: { 'RateLimit-User-Reset': '0' } }))
      .mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }));
    const client = new BuildkiteClient(loadConfig({ BUILDKITE_API_TOKEN: 'x', BUILDKITE_MAX_READ_RETRIES: '2' }), fetchFn as any);
    await expect(client.rest('GET', '/user', undefined, true)).resolves.toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('does not retry permission failures', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('{"message":"forbidden"}', { status: 403 }));
    const client = new BuildkiteClient(loadConfig({ BUILDKITE_API_TOKEN: 'x' }), fetchFn as any);
    await expect(client.rest('GET', '/user', undefined, true)).rejects.toBeInstanceOf(BuildkiteError);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('does not retry destructive operations', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('{"message":"server"}', { status: 500 }));
    const client = new BuildkiteClient(loadConfig({ BUILDKITE_API_TOKEN: 'x' }), fetchFn as any);
    await expect(client.rest('DELETE', '/organizations/o/jobs/j/artifacts/a')).rejects.toBeInstanceOf(BuildkiteError);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});

describe('server registration', () => {
  it('registers all declared tools', () => {
    const cfg = loadConfig({ BUILDKITE_API_TOKEN: 'x' });
    const fakeClient = {} as any;
    const { server } = createServer(cfg, fakeClient);
    const registered = Object.keys((server as any)._registeredTools ?? {});
    expect(registered.length).toBe(Object.keys(TOOL_POLICY).length);
    for (const name of Object.keys(TOOL_POLICY)) expect(registered).toContain(name);
  });
});
