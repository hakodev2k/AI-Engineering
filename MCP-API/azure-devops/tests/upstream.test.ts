import { describe, expect, it, vi } from 'vitest';
import { AzureDevOpsConfig } from '../src/config.js';
import { AzureDevOpsUpstream } from '../src/upstream.js';

const config: AzureDevOpsConfig = {
  organization: 'contoso', authMode: 'entra', bearerToken: 'fake', patEmail: 'x',
  allowedProjects: new Set(), allowedRepositories: new Set(), timeoutMs: 5000,
  maxRetries: 0, mcpEnabled: false
};

describe('MCP/API routing', () => {
  it('falls back to REST for reads when MCP is disabled', async () => {
    const rest = { listProjects: vi.fn(async () => ({ value: [{ name: 'A' }] })) } as any;
    const upstream = new AzureDevOpsUpstream(config, rest);
    const result: any = await upstream.read('core_list_projects', {}, () => rest.listProjects());
    expect(result.value[0].name).toBe('A');
    expect(rest.listProjects).toHaveBeenCalledOnce();
  });

  it('uses REST directly for writes when MCP is unavailable without duplicate retry logic', async () => {
    const rest = { runPipeline: vi.fn(async () => ({ id: 42 })) } as any;
    const upstream = new AzureDevOpsUpstream(config, rest);
    const result: any = await upstream.write('pipelines_write', {}, () => rest.runPipeline());
    expect(result.id).toBe(42);
    expect(rest.runPipeline).toHaveBeenCalledOnce();
  });
});
