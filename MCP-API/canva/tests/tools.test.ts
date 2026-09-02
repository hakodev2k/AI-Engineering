import { describe, expect, it } from 'vitest';
import { registerTools } from '../src/tools.js';
import type { CanvaConfig } from '../src/config.js';

const config: CanvaConfig = {
  accessToken: 'x', apiBaseUrl: 'https://api.canva.com/rest/v1', mcpUrl: 'https://mcp.canva.com/mcp',
  timeoutMs: 1000, maxRetries: 0, requireWriteApproval: true, approvedActions: new Set(),
};

describe('tool registration', () => {
  it('registers the complete scoped tool surface without raw request passthrough', () => {
    const names: string[] = [];
    const server = { tool: (name: string) => { names.push(name); } } as any;
    const api = { request: async () => ({}) } as any;
    registerTools(server, config, api);
    expect(names).toHaveLength(16);
    expect(names).toContain('canva.design.list');
    expect(names).toContain('canva.design.create');
    expect(names).toContain('canva.design.export.create');
    expect(names).not.toContain('canva.request');
  });
});
