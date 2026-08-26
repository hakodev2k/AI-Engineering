import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig, type Config } from './config.js';
import { FlyClient } from './client.js';
import { assertApproval, TOOL_POLICY } from './policy.js';

const appName = z.string().min(1).max(63).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/);
const id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const approval = z.string().min(64).max(128).optional();

function result(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ data, untrusted_provider_content: true }, null, 2) }] };
}

export function buildServer(config: Config = loadConfig(), client = new FlyClient(config)) {
  const server = new McpServer({ name: 'fly-io-connector', version: '1.0.0' });

  server.tool('fly.app.list', 'List Fly Apps in an organization. READ.', { org_slug: z.string().min(1).max(128).optional() }, async ({org_slug}) => {
    const org = org_slug || config.orgSlug;
    if (!org) throw new Error('org_slug or FLY_ORG_SLUG is required');
    return result(await client.listApps(org));
  });
  server.tool('fly.app.get', 'Get Fly App metadata. READ.', { app_name: appName }, async ({app_name}) => result(await client.getApp(app_name)));
  server.tool('fly.app.create', 'Create a Fly App. WRITE; approval required by default.', { app_name: appName, org_slug: z.string().min(1).max(128), network: z.string().min(1).max(128).optional(), approval_id: approval }, async ({approval_id, ...payload}) => {
    assertApproval(config, 'fly.app.create', payload, approval_id); return result(await client.createApp(payload));
  });
  server.tool('fly.app.delete', 'Delete a Fly App. DESTRUCTIVE; explicit approval always required.', { app_name: appName, force: z.boolean().default(false), approval_id: approval }, async ({approval_id, ...payload}) => {
    assertApproval(config, 'fly.app.delete', payload, approval_id); return result(await client.deleteApp(payload.app_name, payload.force));
  });

  server.tool('fly.machine.list', 'List Machines in an app. READ.', { app_name: appName }, async ({app_name}) => result(await client.listMachines(app_name)));
  server.tool('fly.machine.get', 'Get Machine state and configuration. READ.', { app_name: appName, machine_id: id }, async ({app_name,machine_id}) => result(await client.getMachine(app_name,machine_id)));
  server.tool('fly.machine.start', 'Start a Machine. HIGH_RISK; explicit approval required.', { app_name: appName, machine_id: id, approval_id: approval }, async ({approval_id,...payload}) => {
    assertApproval(config, 'fly.machine.start', payload, approval_id); return result(await client.startMachine(payload.app_name,payload.machine_id));
  });
  server.tool('fly.machine.stop', 'Stop a Machine. HIGH_RISK; explicit approval required.', { app_name: appName, machine_id: id, signal: z.enum(['SIGINT','SIGTERM','SIGKILL']).default('SIGINT'), timeout: z.string().regex(/^\d+(ms|s|m)$/).default('5s'), approval_id: approval }, async ({approval_id,...payload}) => {
    assertApproval(config, 'fly.machine.stop', payload, approval_id); return result(await client.stopMachine(payload.app_name,payload.machine_id,payload.signal,payload.timeout));
  });
  server.tool('fly.machine.delete', 'Permanently delete a Machine. DESTRUCTIVE; explicit approval required.', { app_name: appName, machine_id: id, force: z.boolean().default(false), approval_id: approval }, async ({approval_id,...payload}) => {
    assertApproval(config, 'fly.machine.delete', payload, approval_id); return result(await client.deleteMachine(payload.app_name,payload.machine_id,payload.force));
  });

  server.tool('fly.volume.list', 'List volumes in an app. READ.', { app_name: appName }, async ({app_name}) => result(await client.listVolumes(app_name)));
  server.tool('fly.volume.get', 'Get a volume. READ.', { app_name: appName, volume_id: id }, async ({app_name,volume_id}) => result(await client.getVolume(app_name,volume_id)));
  server.tool('fly.volume.create', 'Create persistent storage. WRITE; approval required by default.', { app_name: appName, name: z.string().min(1).max(63), region: z.string().regex(/^[a-z0-9]+$/).max(16), size_gb: z.number().int().min(1).max(500).optional(), snapshot_id: id.optional(), approval_id: approval }, async ({approval_id,app_name,...input}) => {
    const payload = {app_name,...input}; assertApproval(config, 'fly.volume.create', payload, approval_id); return result(await client.createVolume(app_name,input));
  });
  server.tool('fly.volume.delete', 'Permanently delete a volume. DESTRUCTIVE; explicit approval required.', { app_name: appName, volume_id: id, approval_id: approval }, async ({approval_id,...payload}) => {
    assertApproval(config, 'fly.volume.delete', payload, approval_id); return result(await client.deleteVolume(payload.app_name,payload.volume_id));
  });

  return server;
}

export const toolPolicy = TOOL_POLICY;

if (process.env.NODE_ENV !== 'test') {
  const server = buildServer();
  await server.connect(new StdioServerTransport());
}
