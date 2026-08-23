import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertDropletAllowed, assertFirewallAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { DigitalOceanRest } from './rest.js';
import { DigitalOceanMcpBridge } from './upstream.js';

const config = loadConfig();
const rest = new DigitalOceanRest(config);
const mcp = new DigitalOceanMcpBridge(config);
const server = new McpServer({ name: 'digitalocean-mcp-connector', version: '1.0.0' });
const approvalId = z.string().length(64).optional();
const page = z.number().int().min(1).max(10000).optional();
const perPage = z.number().int().min(1).max(200).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('digitalocean.account.get', 'Get the authenticated DigitalOcean account profile.', {}, async () => out(await rest.get('/account')));
server.tool('digitalocean.region.list', 'List DigitalOcean regions and availability metadata.', { page, perPage }, async a => out(await rest.get('/regions', { page: a.page, per_page: a.perPage })));

server.tool('digitalocean.droplet.list', 'List Droplets. Read-only.', { page, perPage, tagName: z.string().max(255).optional() }, async a => {
  const value = a.tagName
    ? await rest.get('/droplets', { page: a.page, per_page: a.perPage, tag_name: a.tagName })
    : await mcp.call('droplets', 'droplet-list', { Page: a.page ?? 1, PerPage: a.perPage ?? 50 }, () => rest.get('/droplets', { page: a.page, per_page: a.perPage }));
  return out(value);
});

server.tool('digitalocean.droplet.get', 'Get one Droplet by numeric ID. Read-only.', { id: z.number().int().positive() }, async a => {
  assertDropletAllowed(config, a.id);
  return out(await mcp.call('droplets', 'droplet-get', { ID: a.id }, () => rest.get(`/droplets/${a.id}`)));
});

server.tool('digitalocean.droplet.create', 'Create a Droplet. Requires explicit approval.', {
  name: z.string().min(1).max(255), region: z.string().min(1).max(64), size: z.string().min(1).max(64), imageSlug: z.string().min(1).max(255),
  sshKeys: z.array(z.union([z.string().min(1).max(255), z.number().int().positive()])).max(100).optional(), tags: z.array(z.string().min(1).max(255)).max(100).optional(),
  backups: z.boolean().optional(), monitoring: z.boolean().optional(), approvalId
}, async a => {
  assertApproval('digitalocean.droplet.create', a.approvalId, config.approvalSecret);
  const mcpArgs = { Name: a.name, Region: a.region, Size: a.size, ImageSlug: a.imageSlug, SSHKeys: a.sshKeys?.map(String), Tags: a.tags, Backup: a.backups ?? false, Monitoring: a.monitoring ?? false };
  return out(await mcp.call('droplets', 'droplet-create', mcpArgs, () => rest.post('/droplets', {
    name: a.name, region: a.region, size: a.size, image: a.imageSlug, ssh_keys: a.sshKeys, tags: a.tags, backups: a.backups ?? false, monitoring: a.monitoring ?? false
  })));
});

async function dropletAction(tool: string, mcpTool: string, id: number, body: Record<string, unknown>) {
  assertDropletAllowed(config, id);
  assertApproval(tool, body.approvalId as string | undefined, config.approvalSecret);
  const clean = { ...body }; delete clean.approvalId;
  return out(await mcp.call('droplets', mcpTool, mcpTool === 'snapshot-droplet' ? { ID: id, Name: clean.name } : { ID: id }, () =>
    rest.post(`/droplets/${id}/actions`, mcpTool === 'snapshot-droplet' ? { type: 'snapshot', name: clean.name } : { type: clean.type })));
}

server.tool('digitalocean.droplet.reboot', 'Reboot a Droplet. HIGH_RISK; requires explicit approval.', { id: z.number().int().positive(), approvalId }, async a => dropletAction('digitalocean.droplet.reboot', 'droplet-reboot', a.id, { type: 'reboot', approvalId: a.approvalId }));
server.tool('digitalocean.droplet.power_on', 'Power on a Droplet. HIGH_RISK; requires explicit approval.', { id: z.number().int().positive(), approvalId }, async a => dropletAction('digitalocean.droplet.power_on', 'power-on-droplet', a.id, { type: 'power_on', approvalId: a.approvalId }));
server.tool('digitalocean.droplet.power_off', 'Power off a Droplet. HIGH_RISK; requires explicit approval.', { id: z.number().int().positive(), approvalId }, async a => dropletAction('digitalocean.droplet.power_off', 'power-off-droplet', a.id, { type: 'power_off', approvalId: a.approvalId }));
server.tool('digitalocean.droplet.snapshot', 'Create a Droplet snapshot. Requires explicit approval.', { id: z.number().int().positive(), name: z.string().min(1).max(255), approvalId }, async a => dropletAction('digitalocean.droplet.snapshot', 'snapshot-droplet', a.id, { name: a.name, approvalId: a.approvalId }));

server.tool('digitalocean.firewall.list', 'List Cloud Firewalls. Read-only.', { page, perPage }, async a => out(await mcp.call('networking', 'firewall-list', { Page: a.page ?? 1, PerPage: a.perPage ?? 20 }, () => rest.get('/firewalls', { page: a.page, per_page: a.perPage }))));
server.tool('digitalocean.firewall.get', 'Get one Cloud Firewall. Read-only.', { id: z.string().uuid() }, async a => {
  assertFirewallAllowed(config, a.id);
  return out(await mcp.call('networking', 'firewall-get', { ID: a.id }, () => rest.get(`/firewalls/${a.id}`)));
});

server.tool('digitalocean.firewall.create', 'Create a Cloud Firewall with one inbound and one outbound rule. HIGH_RISK; requires approval.', {
  name: z.string().min(1).max(255), inboundProtocol: z.enum(['tcp', 'udp', 'icmp']), inboundPortRange: z.string().min(1).max(64), inboundSource: z.string().min(1).max(255),
  outboundProtocol: z.enum(['tcp', 'udp', 'icmp']), outboundPortRange: z.string().min(1).max(64), outboundDestination: z.string().min(1).max(255),
  dropletIds: z.array(z.number().int().positive()).max(100).optional(), tags: z.array(z.string().min(1).max(255)).max(100).optional(), approvalId
}, async a => {
  assertApproval('digitalocean.firewall.create', a.approvalId, config.approvalSecret);
  a.dropletIds?.forEach(id => assertDropletAllowed(config, id));
  const mcpArgs = { Name: a.name, InboundProtocol: a.inboundProtocol, InboundPortRange: a.inboundPortRange, InboundSource: a.inboundSource, OutboundProtocol: a.outboundProtocol, OutboundPortRange: a.outboundPortRange, OutboundDestination: a.outboundDestination, DropletIDs: a.dropletIds, Tags: a.tags };
  return out(await mcp.call('networking', 'firewall-create', mcpArgs, () => rest.post('/firewalls', {
    name: a.name,
    inbound_rules: [{ protocol: a.inboundProtocol, ports: a.inboundPortRange, sources: { addresses: [a.inboundSource] } }],
    outbound_rules: [{ protocol: a.outboundProtocol, ports: a.outboundPortRange, destinations: { addresses: [a.outboundDestination] } }],
    droplet_ids: a.dropletIds, tags: a.tags
  })));
});

server.tool('digitalocean.firewall.add_droplets', 'Attach Droplets to a Cloud Firewall. HIGH_RISK; requires approval.', {
  id: z.string().uuid(), dropletIds: z.array(z.number().int().positive()).min(1).max(100), approvalId
}, async a => {
  assertFirewallAllowed(config, a.id);
  a.dropletIds.forEach(id => assertDropletAllowed(config, id));
  assertApproval('digitalocean.firewall.add_droplets', a.approvalId, config.approvalSecret);
  return out(await mcp.call('networking', 'firewall-add-droplets', { ID: a.id, DropletIDs: a.dropletIds }, () => rest.post(`/firewalls/${a.id}/droplets`, { droplet_ids: a.dropletIds })));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
