import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { UpCloudClient } from './client.js';
import { requirePermission } from './policy.js';

const client = new UpCloudClient();
const uuid = z.string().uuid();
const approved = z.boolean().default(false);
const server = new McpServer({ name: 'upcloud', version: '1.0.0' });
const text = (v: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(v, null, 2) }] });

server.tool('upcloud.zone.list', 'List UpCloud zones. READ.', {}, async () => text(await client.listZones()));
server.tool('upcloud.plan.list', 'List server plans. READ.', {}, async () => text(await client.listPlans()));
server.tool('upcloud.server.list', 'List Cloud Servers. READ.', {}, async () => text(await client.listServers()));
server.tool('upcloud.server.get', 'Get one Cloud Server. READ.', { uuid }, async ({ uuid }) => text(await client.getServer(uuid)));
server.tool('upcloud.storage.list', 'List storage resources. READ.', {}, async () => text(await client.listStorages()));
server.tool('upcloud.storage.get', 'Get storage metadata. READ.', { uuid }, async ({ uuid }) => text(await client.getStorage(uuid)));
server.tool('upcloud.ip_address.list', 'List IP addresses. READ.', {}, async () => text(await client.listIpAddresses()));

const createSchema = {
  zone: z.string().min(1).max(64), hostname: z.string().min(1).max(255), title: z.string().min(1).max(255),
  plan: z.string().min(1).max(128), storageUuid: uuid, passwordDelivery: z.enum(['none','email']).default('none'), approval: approved
};
server.tool('upcloud.server.create', 'Create a Cloud Server from an existing storage/template UUID. HIGH_RISK; explicit approval required.', createSchema,
  async ({ zone, hostname, title, plan, storageUuid, passwordDelivery, approval }) => {
    requirePermission('HIGH_RISK', approval);
    const payload = { server: { zone, hostname, title, plan, password_delivery: passwordDelivery, storage_devices: { storage_device: [{ action: 'clone', storage: storageUuid, title: `${hostname} OS disk` }] } } };
    return text(await client.createServer(payload));
  });

for (const [name, desc, fn] of [
  ['upcloud.server.start','Start a stopped Cloud Server. HIGH_RISK.', (id:string) => client.startServer(id)],
  ['upcloud.server.stop','Gracefully stop a Cloud Server. HIGH_RISK.', (id:string) => client.stopServer(id)],
  ['upcloud.server.restart','Restart a Cloud Server. HIGH_RISK.', (id:string) => client.restartServer(id)]
] as const) {
  server.tool(name, desc, { uuid, approval: approved }, async ({ uuid, approval }) => { requirePermission('HIGH_RISK', approval); return text(await fn(uuid)); });
}

server.tool('upcloud.server.delete', 'Delete a Cloud Server. DESTRUCTIVE; disabled by default and requires strong explicit approval.', { uuid, approval: approved },
  async ({ uuid, approval }) => { requirePermission('DESTRUCTIVE', approval); return text(await client.deleteServer(uuid)); });

await server.connect(new StdioServerTransport());
