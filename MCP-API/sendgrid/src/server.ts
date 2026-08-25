import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig, type SendGridConfig } from './config.js';
import { SendGridClient } from './client.js';
import { assertPolicy } from './policy.js';

const email = z.string().email().max(320);
const id = z.string().min(1).max(200).regex(/^[A-Za-z0-9._-]+$/);
const approval = z.string().min(64).max(128).optional();

export function buildServer(config: SendGridConfig, client = new SendGridClient(config)) {
  const server = new McpServer({ name: 'sendgrid-connector', version: '1.0.0' });
  const ok = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify({ data, untrusted_provider_content: true }) }] });

  server.tool('sendgrid.account.scopes.get', 'Return scopes available to the current SendGrid API key.', {}, async () => {
    return ok(await client.request('GET', '/v3/scopes'));
  });

  server.tool('sendgrid.sender.list', 'List verified/configured senders visible to this account.', {
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).max(10000).default(0)
  }, async ({ limit, offset }) => ok(await client.request('GET', `/v3/senders?limit=${limit}&offset=${offset}`)));

  server.tool('sendgrid.template.list', 'List SendGrid templates.', {
    pageSize: z.number().int().min(1).max(200).default(50),
    generations: z.enum(['legacy', 'dynamic']).default('dynamic')
  }, async ({ pageSize, generations }) => ok(await client.request('GET', `/v3/templates?page_size=${pageSize}&generations=${generations}`)));

  server.tool('sendgrid.template.get', 'Get one SendGrid template by ID.', { templateId: id }, async ({ templateId }) => {
    return ok(await client.request('GET', `/v3/templates/${encodeURIComponent(templateId)}`));
  });

  server.tool('sendgrid.template.create', 'Create an empty template. Requires WRITE enablement and explicit approval.', {
    name: z.string().min(1).max(100),
    generation: z.enum(['legacy', 'dynamic']).default('dynamic'),
    approvalId: approval
  }, async ({ approvalId, ...payload }) => {
    assertPolicy(config, 'sendgrid.template.create', payload, approvalId);
    return ok(await client.request('POST', '/v3/templates', payload, false));
  });

  server.tool('sendgrid.template.version.create', 'Create a version under an existing template. Requires WRITE enablement and explicit approval.', {
    templateId: id,
    name: z.string().min(1).max(100),
    subject: z.string().min(1).max(998),
    htmlContent: z.string().min(1).max(1000000),
    plainContent: z.string().max(1000000).optional(),
    active: z.boolean().default(false),
    approvalId: approval
  }, async ({ templateId, approvalId, htmlContent, plainContent, ...rest }) => {
    const payload = { ...rest, html_content: htmlContent, plain_content: plainContent };
    assertPolicy(config, 'sendgrid.template.version.create', { templateId, ...payload }, approvalId);
    return ok(await client.request('POST', `/v3/templates/${encodeURIComponent(templateId)}/versions`, payload, false));
  });

  server.tool('sendgrid.suppression.global.get', 'Check whether an email address is globally suppressed.', { email }, async ({ email }) => {
    return ok(await client.request('GET', `/v3/asm/suppressions/global/${encodeURIComponent(email)}`));
  });

  server.tool('sendgrid.suppression.global.add', 'Add addresses to the global unsubscribe/suppression list. Requires WRITE enablement and explicit approval.', {
    emails: z.array(email).min(1).max(1000),
    approvalId: approval
  }, async ({ emails, approvalId }) => {
    const payload = { recipient_emails: emails };
    assertPolicy(config, 'sendgrid.suppression.global.add', payload, approvalId);
    return ok(await client.request('POST', '/v3/asm/suppressions/global', payload, false));
  });

  server.tool('sendgrid.suppression.global.remove', 'Remove one global suppression, making the address eligible for future sends. HIGH_RISK and explicitly approved.', {
    email,
    approvalId: approval
  }, async ({ email, approvalId }) => {
    const payload = { email };
    assertPolicy(config, 'sendgrid.suppression.global.remove', payload, approvalId);
    return ok(await client.request('DELETE', `/v3/asm/suppressions/global/${encodeURIComponent(email)}`, undefined, false));
  });

  server.tool('sendgrid.suppression.group.list', 'List unsubscribe groups.', {}, async () => {
    return ok(await client.request('GET', '/v3/asm/groups'));
  });

  server.tool('sendgrid.webhook.event.get', 'Read Event Webhook settings.', {}, async () => {
    return ok(await client.request('GET', '/v3/user/webhooks/event/settings'));
  });

  server.tool('sendgrid.webhook.event.update', 'Update Event Webhook URL/enabled state. HIGH_RISK because event data may be sent externally; explicit approval required.', {
    enabled: z.boolean(),
    url: z.string().url().refine((v) => v.startsWith('https://'), 'Webhook URL must use HTTPS'),
    approvalId: approval
  }, async ({ approvalId, ...payload }) => {
    assertPolicy(config, 'sendgrid.webhook.event.update', payload, approvalId);
    return ok(await client.request('PATCH', '/v3/user/webhooks/event/settings', payload, false));
  });

  server.tool('sendgrid.email.send', 'Send a single external email via SendGrid. HIGH_RISK; requires explicit human approval. Suppression bypass options are intentionally not exposed.', {
    from: email,
    fromName: z.string().min(1).max(100).optional(),
    to: email,
    toName: z.string().min(1).max(100).optional(),
    subject: z.string().min(1).max(998),
    text: z.string().max(1000000).optional(),
    html: z.string().max(1000000).optional(),
    replyTo: email.optional(),
    approvalId: approval
  }, async ({ approvalId, from, fromName, to, toName, subject, text, html, replyTo }) => {
    if (!text && !html) throw new Error('At least one of text or html is required');
    const content = [
      ...(text ? [{ type: 'text/plain', value: text }] : []),
      ...(html ? [{ type: 'text/html', value: html }] : [])
    ];
    const payload = {
      personalizations: [{ to: [{ email: to, ...(toName ? { name: toName } : {}) }] }],
      from: { email: from, ...(fromName ? { name: fromName } : {}) },
      subject,
      content,
      ...(replyTo ? { reply_to: { email: replyTo } } : {})
    };
    assertPolicy(config, 'sendgrid.email.send', payload, approvalId);
    return ok(await client.request('POST', '/v3/mail/send', payload, false));
  });

  return server;
}

async function main() {
  const config = loadConfig();
  const server = buildServer(config);
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
