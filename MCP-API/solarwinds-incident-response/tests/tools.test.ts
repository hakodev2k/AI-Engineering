import { describe, expect, it, vi } from 'vitest';
import type { ConnectorConfig } from '../src/config.js';
import { registerTools } from '../src/tools.js';

const config: ConnectorConfig = {
  region: 'us',
  refreshToken: 'refresh',
  approvalToken: 'approval-secret',
  timeoutMs: 1000,
  maxRetries: 0,
  apiBaseUrl: 'https://api.squadcast.com',
  authUrl: 'https://auth.squadcast.com/oauth/access-token'
};

describe('tool registration', () => {
  it('registers the intended provider-scoped tools', () => {
    const names: string[] = [];
    const fakeServer = { tool(name: string) { names.push(name); } } as any;
    const fakeClient = { get: vi.fn(), post: vi.fn(), patch: vi.fn() } as any;

    registerTools(fakeServer, fakeClient, config);

    expect(names).toHaveLength(13);
    expect(names).toContain('solarwinds_ir.incident.get');
    expect(names).toContain('solarwinds_ir.incident.acknowledge');
    expect(names).toContain('solarwinds_ir.schedule.pause');
    expect(names).toContain('solarwinds_ir.audit_log.list');
  });
});
