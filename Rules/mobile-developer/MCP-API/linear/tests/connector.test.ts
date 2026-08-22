import { describe, expect, it } from 'vitest';
import { assertProjectAllowed, assertTeamAllowed, loadConfig } from '../src/config.js';
import { assertApproval, expectedApproval, TOOL_RISK } from '../src/policy.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';

const env = {
  LINEAR_ACCESS_TOKEN: 'test-token-not-real',
  LINEAR_MCP_URL: 'https://mcp.linear.app/mcp',
  LINEAR_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef'
};

describe('configuration', () => {
  it('accepts official read-write and read-only endpoints only', () => {
    expect(loadConfig(env).mcpUrl.toString()).toBe('https://mcp.linear.app/mcp');
    expect(loadConfig({ ...env, LINEAR_MCP_URL: 'https://mcp.linear.app/mcp/readonly' }).mcpUrl.pathname).toBe('/mcp/readonly');
    expect(() => loadConfig({ ...env, LINEAR_MCP_URL: 'https://example.com/mcp' })).toThrow(/official Linear MCP/);
  });

  it('enforces team/project allowlists', () => {
    const cfg = loadConfig({ ...env, LINEAR_ALLOWED_TEAM_IDS: 'team-a', LINEAR_ALLOWED_PROJECT_IDS: 'project-a' });
    expect(() => assertTeamAllowed(cfg, 'team-a')).not.toThrow();
    expect(() => assertTeamAllowed(cfg, 'team-b')).toThrow(/not allowed/);
    expect(() => assertProjectAllowed(cfg, 'project-b')).toThrow(/not allowed/);
  });
});

describe('policy', () => {
  it('uses a fixed upstream allowlist', () => {
    expect(ALLOWED_UPSTREAM_TOOLS.size).toBe(10);
    expect(ALLOWED_UPSTREAM_TOOLS.has('execute_any_api_request')).toBe(false);
    expect(Object.keys(TOOL_RISK)).toHaveLength(10);
  });

  it('does not require approval for reads', () => {
    expect(() => assertApproval('linear.issue.get', undefined, env.LINEAR_APPROVAL_SECRET)).not.toThrow();
  });

  it('requires out-of-band approval for writes', () => {
    expect(() => assertApproval('linear.issue.save', undefined, env.LINEAR_APPROVAL_SECRET)).toThrow(/explicit human approval/);
    const approval = expectedApproval('linear.issue.save', env.LINEAR_APPROVAL_SECRET);
    expect(() => assertApproval('linear.issue.save', approval, env.LINEAR_APPROVAL_SECRET)).not.toThrow();
  });
});
