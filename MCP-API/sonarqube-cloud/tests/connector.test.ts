import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig, type ConnectorConfig } from '../src/config.js';
import { invokeTool, stripConnectorFields } from '../src/server.js';
import { TOOL_BY_NAME, TOOLS } from '../src/tools.js';
import type { Upstream } from '../src/upstream.js';

function config(overrides: Partial<ConnectorConfig> = {}): ConnectorConfig {
  return { token: 'secret-token', org: 'acme', timeoutMs: 30000, approvalSecret: 'approval-secret', ...overrides };
}

function fakeUpstream(result: unknown = { value: 1 }) {
  const call = vi.fn(async () => result);
  const upstream: Upstream = { call, close: vi.fn(async () => undefined) };
  return { upstream, call };
}

describe('configuration', () => {
  it('requires token and organization', () => {
    expect(() => loadConfig({})).toThrow('SONARQUBE_TOKEN');
    expect(() => loadConfig({ SONARQUBE_TOKEN: 'x' })).toThrow('SONARQUBE_ORG');
  });

  it('rejects invalid timeout configuration', () => {
    expect(() => loadConfig({ SONARQUBE_TOKEN: 'x', SONARQUBE_ORG: 'o', SONARQUBE_TIMEOUT_MS: '5' })).toThrow('SONARQUBE_TIMEOUT_MS');
  });
});

describe('tool registry', () => {
  it('registers only explicit scoped tools', () => {
    expect(TOOLS.length).toBe(12);
    expect(TOOLS.every(t => t.name.startsWith('sonarqube.'))).toBe(true);
    expect(TOOL_BY_NAME.has('execute_any_api_request')).toBe(false);
  });

  it('classifies both mutation tools as approval-required', () => {
    const writes = TOOLS.filter(t => t.risk === 'WRITE');
    expect(writes.map(t => t.name).sort()).toEqual([
      'sonarqube.issue.status.change',
      'sonarqube.security_hotspot.review'
    ]);
    expect(writes.every(t => t.approval)).toBe(true);
  });
});

describe('invocation', () => {
  it('maps a read tool to the official upstream MCP tool', async () => {
    const { upstream, call } = fakeUpstream({ projects: [] });
    await invokeTool(config(), upstream, 'sonarqube.project.search', { q: 'demo', pageSize: 10 });
    expect(call).toHaveBeenCalledWith('search_my_sonarqube_projects', { q: 'demo', pageSize: 10 });
  });

  it('rejects unknown fields before any upstream call', async () => {
    const { upstream, call } = fakeUpstream();
    await expect(invokeTool(config(), upstream, 'sonarqube.rule.get', { key: 'java:S100', url: 'https://evil.invalid' })).rejects.toThrow();
    expect(call).not.toHaveBeenCalled();
  });

  it('requires explicit approval for issue status changes', async () => {
    const { upstream, call } = fakeUpstream();
    await expect(invokeTool(config(), upstream, 'sonarqube.issue.status.change', { key: 'AX1', status: 'accept' })).rejects.toThrow('approval');
    expect(call).not.toHaveBeenCalled();
  });

  it('accepts a valid approval token and never forwards it upstream', async () => {
    const { upstream, call } = fakeUpstream({ ok: true });
    const args = { key: 'AX1', status: 'falsepositive' as const };
    const approvalToken = approvalDigest('approval-secret', 'sonarqube.issue.status.change', args);
    await invokeTool(config(), upstream, 'sonarqube.issue.status.change', { ...args, approvalToken });
    expect(call).toHaveBeenCalledWith('change_sonar_issue_status', args);
  });

  it('validates hotspot review resolution', async () => {
    const { upstream } = fakeUpstream();
    const base = { hotspotKey: 'HS1', status: 'REVIEWED' as const };
    const approvalToken = approvalDigest('approval-secret', 'sonarqube.security_hotspot.review', base);
    await expect(invokeTool(config(), upstream, 'sonarqube.security_hotspot.review', { ...base, approvalToken })).rejects.toThrow('resolution');
  });

  it('validates pagination bounds', async () => {
    const { upstream } = fakeUpstream();
    await expect(invokeTool(config(), upstream, 'sonarqube.project.search', { pageSize: 501 })).rejects.toThrow();
  });
});

describe('credential isolation helpers', () => {
  it('strips connector-only approval data', () => {
    expect(stripConnectorFields({ key: 'A', approvalToken: 'x' })).toEqual({ key: 'A' });
  });
});
