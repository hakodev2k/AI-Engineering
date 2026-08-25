import { describe, expect, it, vi } from 'vitest';
import { loadConfig, type Config } from '../src/config.js';
import { approvalDigest, assertApproval, POLICY } from '../src/policy.js';
import { DropboxApiClient } from '../src/dropbox-client.js';
import { DropboxHybrid } from '../src/hybrid.js';

const cfg = (overrides: Partial<Config> = {}): Config => ({
  accessToken: 'test-token',
  refreshToken: undefined,
  appKey: undefined,
  appSecret: undefined,
  mcpAccessToken: undefined,
  mcpUrl: 'https://mcp.dropbox.com/mcp',
  approvalSecret: 'approval-secret',
  requireWriteApproval: true,
  timeoutMs: 100,
  maxRetries: 2,
  ...overrides
});

describe('configuration and security policy', () => {
  it('pins the upstream MCP hostname', () => {
    expect(() => loadConfig({ DROPBOX_MCP_URL: 'https://evil.example/mcp' })).toThrow(/mcp\.dropbox\.com/);
  });

  it('requires app credentials when refresh-token auth is configured', () => {
    expect(() => loadConfig({ DROPBOX_REFRESH_TOKEN: 'r' })).toThrow(/APP_KEY/);
  });

  it('registers the expected risk policy surface', () => {
    expect(Object.keys(POLICY)).toHaveLength(13);
    expect(POLICY['dropbox.file.delete']).toBe('DESTRUCTIVE');
    expect(POLICY['dropbox.shared_link.create']).toBe('HIGH_RISK');
  });

  it('canonicalizes approval payloads independent of object key order', () => {
    expect(approvalDigest('s', 'tool', { b: 2, a: { y: 2, x: 1 } }))
      .toBe(approvalDigest('s', 'tool', { a: { x: 1, y: 2 }, b: 2 }));
  });

  it('denies mutation without explicit approval', () => {
    expect(() => assertApproval('dropbox.folder.create', { path: '/x' }, undefined, cfg())).toThrow(/explicit human approval/);
  });

  it('accepts a matching out-of-band approval digest', () => {
    const args = { path: '/x' };
    const token = approvalDigest('approval-secret', 'dropbox.folder.create', args);
    expect(() => assertApproval('dropbox.folder.create', args, token, cfg())).not.toThrow();
  });
});

describe('SDK reliability', () => {
  it('retries throttled reads with bounded retry', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce({ status: 429, message: 'rate limited', headers: { get: () => '0' } })
      .mockResolvedValueOnce({ result: { entries: [], has_more: false, cursor: 'c' } });
    const fake = { filesListFolder: fn };
    const client = new DropboxApiClient(cfg(), fake, async () => {});
    const out: any = await client.listFolder({ path: '' });
    expect(out.cursor).toBe('c');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry writes after provider/server errors', async () => {
    const fn = vi.fn().mockRejectedValue({ status: 500, message: 'server error' });
    const client = new DropboxApiClient(cfg(), { filesCreateFolderV2: fn }, async () => {});
    await expect(client.createFolder('/x')).rejects.toThrow(/HTTP 500/);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('uses list_folder/continue when a cursor is supplied', async () => {
    const cont = vi.fn().mockResolvedValue({ result: { entries: [{ name: 'next' }], has_more: false, cursor: 'c2' } });
    const first = vi.fn();
    const client = new DropboxApiClient(cfg(), { filesListFolderContinue: cont, filesListFolder: first }, async () => {});
    const out: any = await client.listFolder({ path: '', cursor: 'c1' });
    expect(out.entries[0].name).toBe('next');
    expect(cont).toHaveBeenCalledWith({ cursor: 'c1' }, expect.anything());
    expect(first).not.toHaveBeenCalled();
  });

  it('enforces timeouts', async () => {
    const never = vi.fn().mockImplementation(() => new Promise(() => {}));
    const client = new DropboxApiClient(cfg({ timeoutMs: 5, maxRetries: 0 }), { usersGetCurrentAccount: never }, async () => {});
    await expect(client.whoAmI()).rejects.toThrow(/timed out/);
  });
});

describe('hybrid routing', () => {
  it('falls back to SDK/API for reads when official MCP fails', async () => {
    const mcp = { enabled: true, call: vi.fn().mockRejectedValue(new Error('mcp unavailable')), close: vi.fn().mockResolvedValue(undefined) };
    const api: any = { whoAmI: vi.fn().mockResolvedValue({ account_id: 'dbid:test' }) };
    const hybrid = new DropboxHybrid(cfg(), { mcp, api });
    await expect(hybrid.whoAmI()).resolves.toEqual({ account_id: 'dbid:test' });
    expect(api.whoAmI).toHaveBeenCalledTimes(1);
  });

  it('never auto-falls back writes after an MCP-side failure', async () => {
    const mcp = { enabled: true, call: vi.fn().mockRejectedValue(new Error('ambiguous write failure')), close: vi.fn().mockResolvedValue(undefined) };
    const api: any = { createFolder: vi.fn().mockResolvedValue({}) };
    const hybrid = new DropboxHybrid(cfg(), { mcp, api });
    await expect(hybrid.createFolder('/x')).rejects.toThrow(/ambiguous write failure/);
    expect(api.createFolder).not.toHaveBeenCalled();
  });
});
