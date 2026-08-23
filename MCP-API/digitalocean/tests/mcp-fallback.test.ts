import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { DigitalOceanMcpBridge } from '../src/upstream.js';

describe('MCP fallback', () => {
  it('falls back when MCP is disabled', async () => {
    const config = loadConfig({ DIGITALOCEAN_API_TOKEN: 'dop_v1_test', DIGITALOCEAN_MCP_ENABLED: 'false' });
    const bridge = new DigitalOceanMcpBridge(config);
    const result = await bridge.call('droplets', 'droplet-list', {}, async () => ({ droplets: [{ id: 1 }] }));
    expect(result).toEqual({ droplets: [{ id: 1 }] });
  });

  it('falls back when the MCP process cannot start', async () => {
    const config = loadConfig({ DIGITALOCEAN_API_TOKEN: 'dop_v1_test', DIGITALOCEAN_MCP_COMMAND: '__missing_digitalocean_mcp_command__' });
    const bridge = new DigitalOceanMcpBridge(config);
    const result = await bridge.call('networking', 'firewall-list', {}, async () => ({ firewalls: [] }));
    expect(result).toEqual({ firewalls: [] });
  });
});
