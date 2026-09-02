import { describe, expect, it, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from '../src/tools.js';

describe('tool registration', () => {
  it('registers all 13 scoped tools without live credentials', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    registerTools(server, { get: vi.fn() } as any, { call: vi.fn(), close: vi.fn() } as any);
    const tools = Object.keys((server as any)._registeredTools ?? {});
    expect(tools.length).toBe(13);
    expect(tools).toContain('rootly.incident.get');
    expect(tools).toContain('rootly.oncall.handoff.get');
    expect(tools).not.toContain('rootly.incident.delete');
  });
});
