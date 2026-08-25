import { describe, expect, it } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertAllowed, TOOL_POLICY } from '../src/policy.js';
import { assertReadOnlySql } from '../src/validate.js';

describe('configuration', () => {
  it('defaults to official read-only Neon MCP', () => {
    const c = loadConfig({} as NodeJS.ProcessEnv);
    expect(c.readonly).toBe(true);
    expect(c.mcpUrl).toContain('https://mcp.neon.tech/mcp');
    expect(c.mcpUrl).toContain('readonly=true');
  });
  it('rejects non-official MCP hosts', () => {
    expect(() => loadConfig({ NEON_MCP_URL: 'https://evil.example/mcp' } as NodeJS.ProcessEnv)).toThrow();
  });
  it('adds project scope', () => {
    const c = loadConfig({ NEON_PROJECT_ID: 'proj_test' } as NodeJS.ProcessEnv);
    expect(c.mcpUrl).toContain('projectId=proj_test');
  });
});

describe('permission model', () => {
  it('registers 13 scoped tools', () => expect(Object.keys(TOOL_POLICY)).toHaveLength(13));
  it('allows reads without approval', () => {
    const c = loadConfig({} as NodeJS.ProcessEnv);
    expect(() => assertAllowed('neon.project.list', c)).not.toThrow();
  });
  it('blocks writes in readonly mode', () => {
    const c = loadConfig({ NEON_READONLY: 'true', NEON_APPROVAL_SECRET: 's' } as NodeJS.ProcessEnv);
    expect(() => assertAllowed('neon.branch.create', c, approvalDigest('s', 'neon.branch.create'))).toThrow(/disabled/);
  });
  it('requires explicit approval for writes', () => {
    const c = loadConfig({ NEON_READONLY: 'false', NEON_APPROVAL_SECRET: 's' } as NodeJS.ProcessEnv);
    expect(() => assertAllowed('neon.branch.create', c)).toThrow(/approval/);
    expect(() => assertAllowed('neon.branch.create', c, approvalDigest('s', 'neon.branch.create'))).not.toThrow();
  });
  it('requires explicit approval for destructive operations', () => {
    const c = loadConfig({ NEON_READONLY: 'false', NEON_APPROVAL_SECRET: 's' } as NodeJS.ProcessEnv);
    expect(() => assertAllowed('neon.project.delete', c)).toThrow(/approval/);
    expect(() => assertAllowed('neon.project.delete', c, approvalDigest('s', 'neon.project.delete'))).not.toThrow();
  });
});

describe('SQL safety', () => {
  it('allows one read query', () => expect(() => assertReadOnlySql('SELECT id FROM users LIMIT 5')).not.toThrow());
  it('allows CTE reads', () => expect(() => assertReadOnlySql('WITH x AS (SELECT 1) SELECT * FROM x')).not.toThrow());
  it('rejects mutations and multi statements', () => {
    expect(() => assertReadOnlySql('DELETE FROM users')).toThrow();
    expect(() => assertReadOnlySql('SELECT 1; DROP TABLE users;')).toThrow();
  });
});
