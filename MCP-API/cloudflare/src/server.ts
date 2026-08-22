import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { CloudflareClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new CloudflareClient(config);
const server = new McpServer({ name: 'cloudflare-connector', version: '1.0.0' });

const ZoneId = z.string().regex(/^[a-f0-9]{32}$/i, 'zone_id must be a 32-character Cloudflare ID');
const RecordId = z.string().regex(/^[a-f0-9]{32}$/i, 'record_id must be a 32-character Cloudflare ID');
const DnsType = z.enum(['A','AAAA','CNAME','TXT','MX','SRV','CAA','NS']);
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });

server.tool('cloudflare.zone.list', 'List zones visible to the configured API token. READ.', {
  name: z.string().min(1).max(253).optional(), page: z.number().int().min(1).max(1000).default(1), per_page: z.number().int().min(1).max(50).default(20)
}, async (args) => json(await client.request('/zones', { query: args })));

server.tool('cloudflare.zone.get', 'Get one zone by ID. READ.', { zone_id: ZoneId },
  async ({ zone_id }) => json(await client.request(`/zones/${zone_id}`)));

server.tool('cloudflare.dns.record.list', 'List DNS records in a zone. READ.', {
  zone_id: ZoneId, type: DnsType.optional(), name: z.string().min(1).max(253).optional(), page: z.number().int().min(1).default(1), per_page: z.number().int().min(1).max(100).default(50)
}, async ({ zone_id, ...query }) => json(await client.request(`/zones/${zone_id}/dns_records`, { query })));

server.tool('cloudflare.dns.record.get', 'Get one DNS record. READ.', { zone_id: ZoneId, record_id: RecordId },
  async ({ zone_id, record_id }) => json(await client.request(`/zones/${zone_id}/dns_records/${record_id}`)));

const DnsWrite = {
  zone_id: ZoneId,
  type: DnsType,
  name: z.string().min(1).max(253),
  content: z.string().min(1).max(4096),
  ttl: z.number().int().min(1).max(86400).default(1),
  proxied: z.boolean().optional(),
  priority: z.number().int().min(0).max(65535).optional(),
  comment: z.string().max(500).optional()
};

server.tool('cloudflare.dns.record.create', 'Create a DNS record. WRITE; operator approval required by default.', DnsWrite,
  async ({ zone_id, ...body }) => { assertWriteAllowed(config, zone_id, 'cloudflare.dns.record.create'); return json(await client.request(`/zones/${zone_id}/dns_records`, { method: 'POST', body })); });

server.tool('cloudflare.dns.record.update', 'Update a DNS record. WRITE; operator approval required by default.', { record_id: RecordId, ...DnsWrite },
  async ({ zone_id, record_id, ...body }) => { assertWriteAllowed(config, zone_id, 'cloudflare.dns.record.update'); return json(await client.request(`/zones/${zone_id}/dns_records/${record_id}`, { method: 'PATCH', body })); });

server.tool('cloudflare.dns.record.delete', 'Delete a DNS record. DESTRUCTIVE; disabled by default and requires explicit operator approval.', { zone_id: ZoneId, record_id: RecordId },
  async ({ zone_id, record_id }) => { assertWriteAllowed(config, zone_id, 'cloudflare.dns.record.delete', true); return json(await client.request(`/zones/${zone_id}/dns_records/${record_id}`, { method: 'DELETE' })); });

server.tool('cloudflare.cache.purge.urls', 'Purge specific cached URLs. HIGH_RISK WRITE; operator approval required.', {
  zone_id: ZoneId, files: z.array(z.string().url()).min(1).max(30)
}, async ({ zone_id, files }) => { assertWriteAllowed(config, zone_id, 'cloudflare.cache.purge.urls'); return json(await client.request(`/zones/${zone_id}/purge_cache`, { method: 'POST', body: { files } })); });

server.tool('cloudflare.cache.purge.everything', 'Purge all cached content for a zone. HIGH_RISK WRITE; explicit operator approval required.', { zone_id: ZoneId },
  async ({ zone_id }) => { assertWriteAllowed(config, zone_id, 'cloudflare.cache.purge.everything'); return json(await client.request(`/zones/${zone_id}/purge_cache`, { method: 'POST', body: { purge_everything: true } })); });

await server.connect(new StdioServerTransport());
