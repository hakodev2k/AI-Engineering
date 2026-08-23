import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { VercelMcp } from '../src/mcp.js';

describe('MCP fallback', () => {
  it('returns undefined without MCP credential so caller can use REST', async () => {
    const config = loadConfig({ VERCEL_ACCESS_TOKEN: 'test', VERCEL_MCP_ENABLED: 'true' });
    await expect(new VercelMcp(config).tryCall('project.list', {})).resolves.toBeUndefined();
  });
  it('returns undefined when MCP is disabled', async () => {
    const config = loadConfig({ VERCEL_ACCESS_TOKEN: 'test', VERCEL_MCP_ENABLED: 'false', VERCEL_MCP_ACCESS_TOKEN: 'unused' });
    await expect(new VercelMcp(config).tryCall('deployment.list', {})).resolves.toBeUndefined();
  });
});
