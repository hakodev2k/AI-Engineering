import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { AnyZodObject } from 'zod';
import { loadConfig } from './config.js';
import { PostmarkUpstream, type Upstream } from './upstream.js';
import { invoke, schemas } from './tools.js';

const config = loadConfig();
const upstream: Upstream = new PostmarkUpstream(config);
const server = new McpServer({ name: 'postmark-connector', version: '1.0.0' });

function result(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] };
}

function register(name: string, description: string, schema: AnyZodObject, upstreamName: string) {
  server.tool(name, description, schema.shape, async (args) => {
    const parsed = schema.parse(args) as Record<string, unknown>;
    return result(await invoke(upstream, config, name, upstreamName, parsed));
  });
}

register('postmark.server.get', 'READ: Get Postmark server configuration and tracking settings.', schemas.empty, 'getServerInfo');
register('postmark.email.search', 'READ: Search outbound email history with bounded filters and pagination.', schemas.emailSearch, 'searchOutboundMessages');
register('postmark.email.get', 'READ: Get details and event timeline for one outbound message.', schemas.messageGet, 'getMessageDetails');
register('postmark.delivery.diagnose', 'READ: Diagnose delivery for a recipient using Postmark message, bounce, and suppression data.', schemas.diagnose, 'diagnoseDelivery');
register('postmark.stats.get', 'READ: Retrieve delivery statistics for a bounded date range.', schemas.stats, 'getDeliveryStats');
register('postmark.template.list', 'READ: List templates on the configured Postmark server.', schemas.empty, 'listTemplates');
register('postmark.template.get', 'READ: Retrieve one Postmark template by ID or alias.', schemas.templateGet, 'getTemplate');
register('postmark.email.send', 'HIGH_RISK: Send an external transactional email. Requires approval bound to the exact arguments.', schemas.emailSend, 'sendEmail');
register('postmark.template.send', 'HIGH_RISK: Send an external email using a Postmark template. Requires approval bound to the exact arguments.', schemas.templateSend, 'sendEmailWithTemplate');
register('postmark.webhook.list', 'READ: List configured Postmark webhooks.', schemas.webhookList, 'listWebhooks');
register('postmark.webhook.create', 'HIGH_RISK: Register a persistent HTTPS webhook. Requires explicit approval and optional URL allowlist.', schemas.webhookCreate, 'createWebhook');
register('postmark.webhook.delete', 'DESTRUCTIVE: Permanently delete a webhook. Requires explicit approval.', schemas.webhookDelete, 'deleteWebhook');

const transport = new StdioServerTransport();
await server.connect(transport);

async function shutdown() {
  await upstream.close();
  process.exit(0);
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
