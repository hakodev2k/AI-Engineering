import { describe, expect, it } from 'vitest';
import { assertRepositoryAllowed, loadConfig } from '../src/config.js';
import { assertApproval, expectedApproval, TOOL_RISK } from '../src/policy.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';

const baseEnv = {
  GITHUB_ACCESS_TOKEN: 'test-token-not-real',
  GITHUB_MCP_URL: 'https://api.githubcopilot.com/mcp/',
  GITHUB_APPROVAL_SECRET: '0123456789abcdef0123456789abcdef'
};

describe('configuration', () => {
  it('accepts only the official remote MCP endpoint', () => {
    expect(loadConfig(baseEnv).mcpUrl.toString()).toBe('https://api.githubcopilot.com/mcp/');
    expect(() => loadConfig({ ...baseEnv, GITHUB_MCP_URL: 'https://evil.example/mcp/' })).toThrow(/official GitHub remote MCP/);
  });

  it('enforces owner and repository allowlists', () => {
    const cfg = loadConfig({ ...baseEnv, GITHUB_ALLOWED_OWNERS: 'openai', GITHUB_ALLOWED_REPOSITORIES: 'openai/example' });
    expect(() => assertRepositoryAllowed(cfg, 'openai', 'example')).not.toThrow();
    expect(() => assertRepositoryAllowed(cfg, 'other', 'example')).toThrow(/not allowed/);
  });
});

describe('tool policy', () => {
  it('registers a fixed capability set and no arbitrary request tool', () => {
    expect(ALLOWED_UPSTREAM_TOOLS.size).toBe(12);
    expect(ALLOWED_UPSTREAM_TOOLS.has('execute_any_api_request')).toBe(false);
    expect(Object.keys(TOOL_RISK)).toHaveLength(12);
  });

  it('allows reads without approval', () => {
    expect(() => assertApproval('github.file.read', undefined, baseEnv.GITHUB_APPROVAL_SECRET)).not.toThrow();
  });

  it('requires a valid out-of-band approval for writes', () => {
    expect(() => assertApproval('github.issue.create', undefined, baseEnv.GITHUB_APPROVAL_SECRET)).toThrow(/requires explicit human approval/);
    const token = expectedApproval('github.issue.create', baseEnv.GITHUB_APPROVAL_SECRET);
    expect(() => assertApproval('github.issue.create', token, baseEnv.GITHUB_APPROVAL_SECRET)).not.toThrow();
  });

  it('classifies merge as high risk', () => {
    expect(TOOL_RISK['github.pull_request.merge']).toBe('HIGH_RISK');
  });
});
