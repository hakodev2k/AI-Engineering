import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/auth.js';
import { buildTools } from '../src/tools.js';
import { PermissionError } from '../src/policy.js';
import type { GristUpstream } from '../src/upstream.js';

function cfg(overrides: Record<string,string> = {}) {
  return loadConfig({
    GRIST_API_KEY: 'test-key',
    GRIST_MCP_URL: 'https://docs.getgrist.com/api/mcp',
    ...overrides,
  });
}

function fake(): GristUpstream & { call: ReturnType<typeof vi.fn> } {
  return {
    connect: vi.fn(async () => undefined),
    close: vi.fn(async () => undefined),
    call: vi.fn(async (name: string, args: Record<string,unknown>) => ({ name, args })),
  } as any;
}

describe('configuration', () => {
  it('requires a credential', () => expect(() => loadConfig({})).toThrow(/GRIST_API_KEY/));
  it('rejects insecure remote MCP URLs', () => expect(() => loadConfig({ GRIST_API_KEY:'x', GRIST_MCP_URL:'http://example.com/api/mcp' })).toThrow(/HTTPS/));
  it('allows localhost HTTP for development', () => expect(loadConfig({ GRIST_API_KEY:'x', GRIST_MCP_URL:'http://localhost:8484/api/mcp' }).mcpUrl).toMatch(/^http:/));
});

describe('tool registry and policy', () => {
  it('registers exactly sixteen scoped tools', () => {
    const tools = buildTools(cfg(), fake());
    expect(tools).toHaveLength(16);
    expect(new Set(tools.map(t => t.name)).size).toBe(16);
    expect(tools.every(t => t.name.startsWith('grist.'))).toBe(true);
  });

  it('executes a read tool without approval', async () => {
    const up = fake();
    const tool = buildTools(cfg(), up).find(t => t.name === 'grist.document.get')!;
    await expect(tool.run({ docId: 'abc' })).resolves.toBeTruthy();
    expect(up.call).toHaveBeenCalledWith('grist_get_doc_info', { doc_id:'abc' }, true);
  });

  it('denies write when disabled', async () => {
    const tool = buildTools(cfg(), fake()).find(t => t.name === 'grist.record.create')!;
    await expect(tool.run({ docId:'d', tableId:'T', records:[{Name:'A'}], approval:{approved:true} })).rejects.toBeInstanceOf(PermissionError);
  });

  it('requires approval for enabled writes', async () => {
    const tool = buildTools(cfg({ GRIST_ALLOW_WRITE:'true' }), fake()).find(t => t.name === 'grist.record.create')!;
    await expect(tool.run({ docId:'d', tableId:'T', records:[{Name:'A'}] })).rejects.toThrow(/approval/i);
  });

  it('does not mark write calls retryable', async () => {
    const up = fake();
    const tool = buildTools(cfg({ GRIST_ALLOW_WRITE:'true' }), up).find(t => t.name === 'grist.record.create')!;
    await tool.run({ docId:'d', tableId:'T', records:[{Name:'A'}], approval:{approved:true} });
    expect(up.call).toHaveBeenCalledWith('grist_add_records', expect.any(Object), false);
  });

  it('keeps destructive deletion disabled by default', async () => {
    const tool = buildTools(cfg(), fake()).find(t => t.name === 'grist.record.delete')!;
    await expect(tool.run({ docId:'d', tableId:'T', recordIds:[1], approval:{approved:true} })).rejects.toThrow(/DESTRUCTIVE/);
  });

  it('allows destructive deletion only with flag and strong approval', async () => {
    const up = fake();
    const tool = buildTools(cfg({ GRIST_ALLOW_DESTRUCTIVE:'true' }), up).find(t => t.name === 'grist.record.delete')!;
    await tool.run({ docId:'d', tableId:'T', recordIds:[1], approval:{approved:true} });
    expect(up.call).toHaveBeenCalledWith('grist_remove_records', expect.any(Object), false);
  });

  it('validates bounded list sizes', () => {
    const tool = buildTools(cfg(), fake()).find(t => t.name === 'grist.record.list')!;
    expect(() => tool.schema.parse({ docId:'d', tableId:'T', limit:1001 })).toThrow();
  });
});
