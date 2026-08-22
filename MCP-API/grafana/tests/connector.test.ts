import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { assertWriteAllowed, loadConfig } from '../src/config.js';
import { grafanaHealth } from '../src/upstream.js';

const baseEnv = {
  GRAFANA_URL: 'https://example.grafana.net',
  GRAFANA_SERVICE_ACCOUNT_TOKEN: 'test-token',
  GRAFANA_MCP_COMMAND: 'uvx',
  GRAFANA_MCP_ARGS: '["mcp-grafana","-t","stdio","--enabled-tools","search,datasource,dashboard,folder"]',
  GRAFANA_APPROVAL_MODE: 'required',
  GRAFANA_APPROVED_ACTIONS: 'grafana.dashboard.upsert'
};

describe('configuration and approval', () => {
  it('requires URL and service account token', () => expect(() => loadConfig({})).toThrow());
  it('rejects malformed MCP args', () => expect(() => loadConfig({ ...baseEnv, GRAFANA_MCP_ARGS: 'not-json' })).toThrow(/CONFIG_ERROR/));
  it('allows only explicitly approved writes by default', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertWriteAllowed(config, 'grafana.dashboard.upsert')).not.toThrow();
    expect(() => assertWriteAllowed(config, 'grafana.folder.create')).toThrow(/APPROVAL_REQUIRED/);
  });
});

describe('HTTP fallback', () => {
  it('keeps credentials in the connector and calls only configured Grafana origin', async () => {
    const mockFetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      expect(String(url)).toBe('https://example.grafana.net/api/health');
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-token' });
      return new Response(JSON.stringify({ database: 'ok', version: '13.1.0' }), { status: 200 });
    });
    await expect(grafanaHealth(loadConfig(baseEnv), mockFetch as unknown as typeof fetch)).resolves.toMatchObject({ database: 'ok' });
  });

  it('maps failed health requests without retrying unsafe operations', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ message: 'forbidden' }), { status: 403 }));
    await expect(grafanaHealth(loadConfig(baseEnv), mockFetch as unknown as typeof fetch)).rejects.toThrow(/GRAFANA_HTTP_403/);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe('tool surface', () => {
  it('registers eleven scoped tools and no generic upstream escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(x => x[1]);
    expect(names).toEqual([
      'grafana.mcp.status', 'grafana.health.get', 'grafana.dashboard.search', 'grafana.folder.search',
      'grafana.dashboard.get', 'grafana.dashboard.summary', 'grafana.dashboard.panel_queries',
      'grafana.datasource.list', 'grafana.datasource.get', 'grafana.dashboard.upsert', 'grafana.folder.create'
    ]);
    expect(source).not.toContain('execute_any');
    expect(source).not.toContain('raw_request');
  });

  it('allowlists upstream Grafana MCP tools', () => {
    const source = readFileSync(new URL('../src/upstream.ts', import.meta.url), 'utf8');
    expect(source).toContain('UPSTREAM_TOOL_DENIED');
    expect(source).toContain("'update_dashboard'");
    expect(source).toContain("'create_folder'");
    expect(source).toContain("'search_folders'");
  });
});
