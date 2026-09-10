import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { OvhClient } from './client.js';
import { assertAllowed } from './policy.js';

const config = loadConfig();
const client = new OvhClient(config);
const server = new McpServer({ name: 'ovhcloud-connector', version: '1.0.0' });

const serviceName = z.string().min(1).max(128).regex(/^[A-Za-z0-9._-]+$/);
const instanceId = z.string().min(1).max(128).regex(/^[A-Za-z0-9._:-]+$/);
const approvalId = z.string().regex(/^[a-f0-9]{64}$/).optional();
const ok = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify({ untrustedProviderContent: true, data }) }] });

function register(name: string, description: string, schema: any, handler: (a:any)=>Promise<unknown>) {
  server.tool(name, description, schema, async (args:any) => {
    assertAllowed(config, name, args);
    const clean = { ...args }; delete clean.approvalId;
    return ok(await handler(clean));
  });
}

register('ovhcloud.account.get', 'Read the authenticated OVHcloud account profile.', {}, () => client.request('GET','/me'));
register('ovhcloud.cloud.project.list', 'List accessible Public Cloud projects.', {}, () => client.request('GET','/cloud/project'));
register('ovhcloud.cloud.project.get', 'Read one Public Cloud project.', { serviceName }, a => client.request('GET',`/cloud/project/${encodeURIComponent(a.serviceName)}`));
register('ovhcloud.cloud.instance.list', 'List instances in a Public Cloud project.', { serviceName }, a => client.request('GET',`/cloud/project/${encodeURIComponent(a.serviceName)}/instance`));
register('ovhcloud.cloud.instance.get', 'Read one Public Cloud instance.', { serviceName, instanceId }, a => client.request('GET',`/cloud/project/${encodeURIComponent(a.serviceName)}/instance/${encodeURIComponent(a.instanceId)}`));
register('ovhcloud.cloud.instance.reboot', 'Reboot a Public Cloud instance. High risk and approval-gated.', { serviceName, instanceId, approvalId }, a => client.request('POST',`/cloud/project/${encodeURIComponent(a.serviceName)}/instance/${encodeURIComponent(a.instanceId)}/reboot`,{},false));
register('ovhcloud.vps.list', 'List accessible VPS services.', {}, () => client.request('GET','/vps'));
register('ovhcloud.vps.get', 'Read one VPS service.', { serviceName }, a => client.request('GET',`/vps/${encodeURIComponent(a.serviceName)}`));
register('ovhcloud.vps.reboot', 'Reboot a VPS. High risk and approval-gated.', { serviceName, approvalId }, a => client.request('POST',`/vps/${encodeURIComponent(a.serviceName)}/reboot`,{},false));
register('ovhcloud.domain.list', 'List domain services.', {}, () => client.request('GET','/domain'));
register('ovhcloud.domain.get', 'Read one domain service.', { serviceName }, a => client.request('GET',`/domain/${encodeURIComponent(a.serviceName)}`));

const transport = new StdioServerTransport();
await server.connect(transport);
