import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { TailscaleClient } from './client.js';
import { assertApproval } from './policy.js';

const cfg = loadConfig();
const client = new TailscaleClient(cfg);
const server = new McpServer({ name: 'tailscale-connector', version: '1.0.0' });
const deviceId = z.string().min(1).max(256).regex(/^[A-Za-z0-9._:-]+$/);
const approvalId = z.string().regex(/^[a-f0-9]{64}$/).optional();
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify({ data: value, untrustedProviderContent: true }) }] });
const safe = <T extends Record<string,unknown>>(tool: string, fn: (args:T)=>Promise<unknown>) => async (args:T) => {
  try { assertApproval(cfg, tool, args); return json(await fn(args)); }
  catch (e) { return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: e instanceof Error ? e.message : String(e), tool }) }] }; }
};

server.tool('tailscale.device.list', 'List devices in the configured tailnet. READ.', { fields: z.string().max(2000).optional() }, safe('tailscale.device.list', async ({fields}) => {
  const q = fields ? `?fields=${encodeURIComponent(fields as string)}` : '';
  return client.request('GET', client.tailnetPath(`/devices${q}`));
}));
server.tool('tailscale.device.get', 'Get one device. READ.', { deviceId }, safe('tailscale.device.get', async ({deviceId}) => client.request('GET', `/device/${encodeURIComponent(deviceId as string)}`)));
server.tool('tailscale.device.authorize', 'Approve or revoke a device authorization. HIGH_RISK; explicit approval required.', { deviceId, authorized: z.boolean(), approvalId }, safe('tailscale.device.authorize', async ({deviceId,authorized}) => client.request('POST', `/device/${encodeURIComponent(deviceId as string)}/authorized`, { authorized })));
server.tool('tailscale.device.remove', 'Remove a device from the tailnet. DESTRUCTIVE; explicit approval required.', { deviceId, approvalId }, safe('tailscale.device.remove', async ({deviceId}) => client.request('DELETE', `/device/${encodeURIComponent(deviceId as string)}`)));
server.tool('tailscale.routes.get', 'Read advertised and enabled routes for a device. READ.', { deviceId }, safe('tailscale.routes.get', async ({deviceId}) => client.request('GET', `/device/${encodeURIComponent(deviceId as string)}/routes`)));
server.tool('tailscale.routes.update', 'Set enabled subnet/exit-node routes for a device. HIGH_RISK; explicit approval required.', { deviceId, routes: z.array(z.string().min(3).max(64)).max(64), approvalId }, safe('tailscale.routes.update', async ({deviceId,routes}) => client.request('POST', `/device/${encodeURIComponent(deviceId as string)}/routes`, { routes })));
server.tool('tailscale.dns.nameservers.get', 'Read tailnet DNS nameservers. READ.', {}, safe('tailscale.dns.nameservers.get', async () => client.request('GET', client.tailnetPath('/dns/nameservers'))));
server.tool('tailscale.dns.preferences.get', 'Read tailnet DNS preferences, including MagicDNS preference. READ.', {}, safe('tailscale.dns.preferences.get', async () => client.request('GET', client.tailnetPath('/dns/preferences'))));
server.tool('tailscale.dns.searchpaths.get', 'Read tailnet DNS search paths. READ.', {}, safe('tailscale.dns.searchpaths.get', async () => client.request('GET', client.tailnetPath('/dns/searchpaths'))));
server.tool('tailscale.logs.configuration.list', 'Read configuration audit logs. READ.', { start: z.string().datetime().optional(), end: z.string().datetime().optional() }, safe('tailscale.logs.configuration.list', async ({start,end}) => {
  const q = new URLSearchParams(); if (start) q.set('start', start as string); if (end) q.set('end', end as string);
  return client.request('GET', client.tailnetPath(`/logs${q.size ? `?${q}` : ''}`));
}));

await server.connect(new StdioServerTransport());
