import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { BunnyClient, BunnyError } from './client.js';
import { dnsRecordSchema, hostnameSchema, idSchema, ipSchema } from './config.js';
import { enforceRisk } from './policy.js';

export function createServer(client = new BunnyClient()) {
  const server = new McpServer({ name: 'bunny-net-connector', version: '1.0.0' });
  const wrap = async (fn: () => Promise<unknown>) => {
    try {
      return { content: [{ type: 'text' as const, text: JSON.stringify(await fn(), null, 2) }] };
    } catch (error) {
      const payload = error instanceof BunnyError
        ? { error: error.code, message: error.message, status: error.status, retryAfterMs: error.retryAfterMs }
        : { error: 'connector_error', message: error instanceof Error ? error.message : String(error) };
      return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify(payload) }] };
    }
  };

  server.tool('bunny.pull_zone.list', 'List CDN Pull Zones. Risk: READ.', {}, async () => wrap(() => client.request('GET', '/pullzone')));
  server.tool('bunny.pull_zone.get', 'Get one CDN Pull Zone. Risk: READ.', { id: idSchema }, async ({ id }) => wrap(() => client.request('GET', `/pullzone/${id}`)));
  server.tool('bunny.storage_zone.list', 'List Storage Zones. Risk: READ.', {}, async () => wrap(() => client.request('GET', '/storagezone')));
  server.tool('bunny.storage_zone.get', 'Get one Storage Zone. Risk: READ.', { id: idSchema }, async ({ id }) => wrap(() => client.request('GET', `/storagezone/${id}`)));
  server.tool('bunny.dns_zone.list', 'List DNS Zones. Risk: READ.', {}, async () => wrap(() => client.request('GET', '/dnszone')));
  server.tool('bunny.dns_zone.get', 'Get one DNS Zone including its records. Risk: READ.', { id: idSchema }, async ({ id }) => wrap(() => client.request('GET', `/dnszone/${id}`)));
  server.tool('bunny.dns_zone.export', 'Export a DNS Zone. Risk: READ.', { id: idSchema }, async ({ id }) => wrap(() => client.request('GET', `/dnszone/${id}/export`)));

  server.tool('bunny.pull_zone.allowed_referrer.add', 'Add an allowed referrer hostname to a Pull Zone. This changes access-control behavior. Risk: HIGH_RISK; explicit human approval required.', {
    id: idSchema,
    hostname: hostnameSchema,
    approval: z.literal(true),
  }, async ({ id, hostname, approval }) => wrap(async () => {
    enforceRisk('HIGH_RISK', approval);
    return client.request('POST', `/pullzone/${id}/addAllowedReferrer`, { Hostname: hostname }, false);
  }));

  server.tool('bunny.pull_zone.blocked_ip.remove', 'Remove an IP from a Pull Zone block list. This changes security policy. Risk: HIGH_RISK; explicit human approval required.', {
    id: idSchema,
    blocked_ip: ipSchema,
    approval: z.literal(true),
  }, async ({ id, blocked_ip, approval }) => wrap(async () => {
    enforceRisk('HIGH_RISK', approval);
    return client.request('POST', `/pullzone/${id}/removeBlockedIp`, { BlockedIp: blocked_ip }, false);
  }));

  server.tool('bunny.dns_record.add', 'Add a DNS record to an existing DNS Zone. DNS changes can redirect production traffic. Risk: HIGH_RISK; explicit human approval required.', {
    zone_id: idSchema,
    record: dnsRecordSchema,
    approval: z.literal(true),
  }, async ({ zone_id, record, approval }) => wrap(async () => {
    enforceRisk('HIGH_RISK', approval);
    return client.request('PUT', `/dnszone/${zone_id}/records`, record, false);
  }));

  server.tool('bunny.pull_zone.delete', 'Permanently delete a Pull Zone. Risk: DESTRUCTIVE; disabled by default and requires explicit strong human approval.', {
    id: idSchema,
    approval: z.literal(true),
  }, async ({ id, approval }) => wrap(async () => {
    enforceRisk('DESTRUCTIVE', approval);
    return client.request('DELETE', `/pullzone/${id}`, undefined, false);
  }));

  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}
