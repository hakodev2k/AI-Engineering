import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { PostmarkUpstream, type Upstream } from './upstream.js';
import { invoke, schemas } from './tools.js';

const config = loadConfig();
const upstream: Upstream = new PostmarkUpstream(config);
const server = new McpServer({ name: 'postmark-connector', version: '1.0.0' });

function result(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] };
}

function register(name: string, description: string, schema: z.ZodRawShape, upstreamName: string) {
  server.tool(name, description, schema, async (args) => result(await invoke(upstream, config, name, upstreamName, args as Record<string, unknown>)));
}

register('postmark.server.get', 'READ: Get Postmark server configuration and tracking settings.', schemas.empty.shape, 'getServerInfo');
register('postmark.email.search', 'READ: Search outbound email history with bounded filters and pagination.', schemas.emailSearch.shape, 'searchOutboundMessages');
register('postmark.email.get', 'READ: Get details and event timeline for one outbound message.', schemas.messageGet.shape, 'getMessageDetails');
register('postmark.delivery.diagnose', 'READ: Diagnose delivery for a recipient using Postmark message, bounce, and suppression data.', schemas.diagnose.shape, 'diagnoseDelivery');
register('postmark.stats.get', 'READ: Retrieve delivery statistics for a bounded date range.', schemas.stats.shape, 'getDeliveryStats');
register('postmark.template.list', 'READ: List templates on the configured Postmark server.', schemas.empty.shape, 'listTemplates');
register('postmark.template.get', 'READ: Retrieve one Postmark template by ID or alias.', schemas.templateGet.shape, 'getTemplate');
register('postmark.email.send', 'HIGH_RISK: Send an external transactional email. Requires approval bound to the exact arguments.', schemas.emailSend.shape, 'sendEmail');
register('postmark.template.send', 'HIGH_RISK: Send an external email using a Postmark template. Requires approval bound to the exact arguments.', schemas.templateSend.shape, 'sendEmailWithTemplate');
register('postmark.webhook.list', 'READ: List configured Postmark webhooks.', schemas.webhookList.shape, 'listWebhooks');
register('postmark.webhook.create', 'HIGH_RISK: Register a persistent HTTPS webhook. Requires explicit approval and optional URL allowlist.', schemas.webhookCreate.shape, 'createWebhook');
register('postmark.webhook.delete', 'DESTRUCTIVE: Permanently delete a webhook. Requires explicit approval.', schemas.webhookDelete.shape, 'deleteWebhook');

const transport = new StdioServerTransport();
await server.connect(transport);

async function shutdown() {
  await upstream.close();
  process.exit(0);
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
