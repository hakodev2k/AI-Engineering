import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  process.env.SCW_SECRET_KEY = 'test-secret';
  process.env.SCW_ALLOW_HIGH_RISK = 'true';
});

describe('tool catalog', () => {
  it('registers only provider-scoped bounded tools', async () => {
    const { ScalewayClient } = await import('../src/client.js');
    const { buildTools } = await import('../src/tools.js');
    const client = new ScalewayClient(vi.fn() as unknown as typeof fetch);
    const tools = buildTools(client);
    expect(tools).toHaveLength(10);
    expect(tools.every(t => t.name.startsWith('scaleway.'))).toBe(true);
    expect(tools.some(t => /raw|request|execute_any/i.test(t.name))).toBe(false);
  });

  it('validates destructive-looking instance actions out of the schema', async () => {
    const { ScalewayClient } = await import('../src/client.js');
    const { buildTools } = await import('../src/tools.js');
    const client = new ScalewayClient(vi.fn() as unknown as typeof fetch);
    const action = buildTools(client).find(t => t.name === 'scaleway.instance.perform_action')!;
    expect(() => action.inputSchema.parse({ serverId: '11111111-1111-4111-8111-111111111111', action: 'terminate', approved: true })).toThrow();
  });

  it('requires explicit approval before a runtime state change', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ task: { id: 'x' } }), { status: 200 }));
    const { ScalewayClient } = await import('../src/client.js');
    const { buildTools } = await import('../src/tools.js');
    const client = new ScalewayClient(fetchMock as typeof fetch);
    const action = buildTools(client).find(t => t.name === 'scaleway.instance.perform_action')!;
    await expect(action.execute({ zone: 'fr-par-1', serverId: '11111111-1111-4111-8111-111111111111', action: 'reboot', approved: false })).rejects.toThrow(/approval/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
