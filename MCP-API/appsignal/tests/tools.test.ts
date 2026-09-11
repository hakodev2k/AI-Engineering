import { describe, expect, it, vi } from 'vitest';
import { TOOL_SPECS, executeTool } from '../src/tools.js';
import type { Config } from '../src/config.js';

const config: Config = {
  mcpUrl: 'https://appsignal.com/api/mcp',
  token: 'test-token',
  timeoutMs: 1000,
  writeApprovalRequired: true
};

function fakeUpstream(names: string[]) {
  return {
    listTools: vi.fn(async () => names.map(name => ({ name }))),
    callTool: vi.fn(async (name: string, args: Record<string, unknown>) => ({ name, args }))
  } as any;
}

describe('AppSignal tool registry', () => {
  it('registers a useful bounded capability set', () => {
    expect(TOOL_SPECS.length).toBeGreaterThanOrEqual(8);
    expect(new Set(TOOL_SPECS.map(t => t.name)).size).toBe(TOOL_SPECS.length);
    expect(TOOL_SPECS.every(t => t.name.startsWith('appsignal.'))).toBe(true);
  });

  it('keeps all exposed tools read-only', () => {
    expect(TOOL_SPECS.every(t => t.risk === 'READ')).toBe(true);
  });

  it('rejects unknown input fields', async () => {
    const spec = TOOL_SPECS.find(t => t.name === 'appsignal.metric.names')!;
    await expect(executeTool(spec, { appId: 'app', unexpected: true }, fakeUpstream(['get_metric_names']), config)).rejects.toThrow();
  });

  it('fails safely when an official upstream capability disappears', async () => {
    const spec = TOOL_SPECS.find(t => t.name === 'appsignal.logging.search')!;
    await expect(executeTool(spec, { appId: 'app', query: 'level:error', limit: 10 }, fakeUpstream([]), config)).rejects.toThrow('unavailable');
  });

  it('routes metric names to the allowlisted official MCP tool', async () => {
    const upstream = fakeUpstream(['get_metric_names']);
    const spec = TOOL_SPECS.find(t => t.name === 'appsignal.metric.names')!;
    const result = await executeTool(spec, { appId: 'app-1', environment: 'production' }, upstream, config) as any;
    expect(upstream.callTool).toHaveBeenCalledWith('get_metric_names', { app_id: 'app-1', environment: 'production' });
    expect(result.transport).toBe('official-mcp');
  });

  it('pins uptime queries to documented uptime metrics', async () => {
    const upstream = fakeUpstream(['get_metrics_timeseries']);
    const spec = TOOL_SPECS.find(t => t.name === 'appsignal.uptime.errors')!;
    await executeTool(spec, { appId: 'app-1' }, upstream, config);
    expect(upstream.callTool).toHaveBeenCalledWith('get_metrics_timeseries', expect.objectContaining({ metric: 'uptime_monitor_error_count' }));
  });

  it('does not forward provider credentials through tool arguments', () => {
    const serialized = JSON.stringify(TOOL_SPECS.map(t => ({ name: t.name, description: t.description })));
    expect(serialized).not.toContain('APPSIGNAL_MCP_TOKEN');
  });
});
