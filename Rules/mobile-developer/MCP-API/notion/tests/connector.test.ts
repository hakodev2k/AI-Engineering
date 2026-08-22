import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { ALLOWED } from '../src/upstream.js';
import { assertApproval, TOOL_RISK } from '../src/policy.js';

describe('Notion connector configuration', () => {
  it('requires a token', () => {
    expect(() => loadConfig({})).toThrow(/NOTION_ACCESS_TOKEN/);
  });

  it('rejects non-official MCP hosts', () => {
    expect(() => loadConfig({ NOTION_ACCESS_TOKEN: 'secret', NOTION_MCP_URL: 'https://evil.example/mcp' })).toThrow(/official/);
  });

  it('uses the official MCP endpoint by default', () => {
    expect(loadConfig({ NOTION_ACCESS_TOKEN: 'secret' }).mcpUrl).toBe('https://mcp.notion.com/mcp');
  });
});

describe('tool security', () => {
  it('does not allow arbitrary upstream tools', () => {
    expect(ALLOWED.has('execute-anything')).toBe(false);
    expect(ALLOWED.has('notion-fetch')).toBe(true);
  });

  it('requires approval for writes', () => {
    expect(TOOL_RISK['notion.page.create']).toBe('WRITE');
    expect(() => assertApproval('notion.page.create', undefined, 'approved')).toThrow(/approvalId/);
    expect(() => assertApproval('notion.page.create', 'approved', 'approved')).not.toThrow();
  });

  it('allows reads without approval', () => {
    expect(() => assertApproval('notion.search', undefined, undefined)).not.toThrow();
  });
});
