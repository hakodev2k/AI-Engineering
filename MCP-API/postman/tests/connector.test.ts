import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadConfig, type Config } from '../src/config.js';
import { approvalToken, assertAllowed } from '../src/policy.js';
import { PostmanRestClient } from '../src/rest.js';
import { registerTools } from '../src/tools.js';

const config: Config = {
  apiKey: 'test-key',
  apiBaseUrl: 'https://api.getpostman.com',
  mcpUrl: 'https://mcp.postman.com/minimal',
  mcpMode: 'minimal',
  approvalSecret: '0123456789abcdef0123456789abcdef',
  writeApproval: true,
  timeoutMs: 1000,
  maxRetries: 2
};

afterEach(() => vi.unstubAllGlobals());

describe('configuration', () => {
  it('rejects missing credentials', () => {
    expect(() => loadConfig({})).toThrow();
  });

  it('loads least-privilege defaults', () => {
    const c = loadConfig({ POSTMAN_API_KEY: 'x' });
    expect(c.apiBaseUrl).toBe('https://api.getpostman.com');
    expect(c.mcpUrl).toBe('https://mcp.postman.com/minimal');
    expect(c.writeApproval).toBe(true);
  });
});

describe('approval policy', () => {
  it('allows reads without approval', () => {
    expect(() => assertAllowed(config, 'postman.workspace.list', {})).not.toThrow();
  });

  it('denies writes without approval', () => {
    expect(() => assertAllowed(config, 'postman.workspace.create', { workspace: { name: 'X' } })).toThrow(/approval/i);
  });

  it('binds approval to exact tool arguments', () => {
    const args = { workspace: { name: 'X' } };
    const token = approvalToken(config.approvalSecret!, 'postman.workspace.create', args);
    expect(() => assertAllowed(config, 'postman.workspace.create', { ...args, approvalToken: token })).not.toThrow();
    expect(() => assertAllowed(config, 'postman.workspace.create', { workspace: { name: 'Y' }, approvalToken: token })).toThrow(/invalid approval/i);
  });

  it('always requires approval for collection execution', () => {
    const noWriteApproval = { ...config, writeApproval: false };
    expect(() => assertAllowed(noWriteApproval, 'postman.collection.run', { collectionId: 'c' })).toThrow(/approval/i);
  });
});

describe('REST reliability', () => {
  it('retries a safe GET after rate limiting', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: 'slow down' } }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ workspaces: [] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new PostmanRestClient(config);
    await expect(client.listWorkspaces()).resolves.toEqual({ workspaces: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry a mutating POST', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { message: 'temporary' } }), { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new PostmanRestClient(config);
    await expect(client.createWorkspace({ name: 'X' })).rejects.toThrow('temporary');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('tool registration', () => {
  it('registers exactly the documented 15 stable tools', () => {
    const names: string[] = [];
    const fakeServer = { registerTool: (name: string) => { names.push(name); } };
    registerTools(fakeServer as any, config, {} as any, {} as any);
    expect(names).toHaveLength(15);
    expect(names).toContain('postman.collection.run');
    expect(names).toContain('postman.spec.get');
  });
});
