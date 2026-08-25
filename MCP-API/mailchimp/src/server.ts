import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig, type Config } from './config.js';
import { MailchimpClient, MailchimpError } from './client.js';
import { assertApproval, subscriberHash, TOOL_POLICY } from './security.js';

const approvalToken = z.string().regex(/^[a-f0-9]{64}$/).optional();
const id = z.string().min(1).max(128);
const count = z.number().int().min(1).max(1000).default(100);
const offset = z.number().int().min(0).default(0);
const email = z.string().email().max(254);

function textResult(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ untrustedProviderData: true, data }, null, 2) }] };
}

function errorResult(error: unknown) {
  const body = error instanceof MailchimpError
    ? { error: error.name, status: error.status, message: error.message, retryAfterSeconds: error.retryAfterSeconds, provider: error.detail }
    : { error: error instanceof Error ? error.name : 'Error', message: error instanceof Error ? error.message : String(error) };
  return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify(body, null, 2) }] };
}

export function buildServer(config: Config, client = new MailchimpClient(config)): McpServer {
  const server = new McpServer({ name: 'mailchimp-connector', version: '1.0.0' });
  const run = async (tool: string, args: Record<string, unknown>, action: () => Promise<unknown>) => {
    try {
      assertApproval(tool, args, config.approvalSecret);
      return textResult(await action());
    } catch (error) {
      return errorResult(error);
    }
  };

  server.registerTool('mailchimp.account.get', {
    description: 'Read Mailchimp API root/account metadata. Risk: READ. Approval: no.', inputSchema: {}
  }, async () => run('mailchimp.account.get', {}, () => client.request('GET', '/')));

  server.registerTool('mailchimp.audience.list', {
    description: 'List Mailchimp audiences/lists. Risk: READ. Approval: no.',
    inputSchema: { count, offset, beforeDateCreated: z.string().datetime().optional(), sinceDateCreated: z.string().datetime().optional() }
  }, async args => run('mailchimp.audience.list', args, () => client.request('GET', '/lists', { query: { count: args.count, offset: args.offset, before_date_created: args.beforeDateCreated, since_date_created: args.sinceDateCreated } })));

  server.registerTool('mailchimp.audience.get', {
    description: 'Get one Mailchimp audience/list. Risk: READ. Approval: no.', inputSchema: { audienceId: id }
  }, async args => run('mailchimp.audience.get', args, () => client.request('GET', `/lists/${encodeURIComponent(args.audienceId)}`)));

  server.registerTool('mailchimp.member.list', {
    description: 'List members in an audience. Risk: READ. Approval: no.',
    inputSchema: { audienceId: id, count, offset, status: z.enum(['subscribed', 'unsubscribed', 'cleaned', 'pending', 'transactional', 'archived']).optional() }
  }, async args => run('mailchimp.member.list', args, () => client.request('GET', `/lists/${encodeURIComponent(args.audienceId)}/members`, { query: { count: args.count, offset: args.offset, status: args.status } })));

  server.registerTool('mailchimp.member.get', {
    description: 'Get a member by email address. Email is hashed locally and is not placed in the URL. Risk: READ. Approval: no.',
    inputSchema: { audienceId: id, email: email }
  }, async args => run('mailchimp.member.get', args, () => client.request('GET', `/lists/${encodeURIComponent(args.audienceId)}/members/${subscriberHash(args.email)}`)));

  server.registerTool('mailchimp.member.upsert', {
    description: 'Create or update an audience member using Mailchimp PUT member semantics. Risk: WRITE. Explicit approval required.',
    inputSchema: {
      audienceId: id, email: email,
      statusIfNew: z.enum(['subscribed', 'unsubscribed', 'pending', 'transactional']),
      status: z.enum(['subscribed', 'unsubscribed', 'pending', 'transactional']).optional(),
      mergeFields: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
      language: z.string().max(35).optional(), vip: z.boolean().optional(), approvalToken
    }
  }, async args => run('mailchimp.member.upsert', args, () => client.request('PUT', `/lists/${encodeURIComponent(args.audienceId)}/members/${subscriberHash(args.email)}`, { body: {
    email_address: args.email, status_if_new: args.statusIfNew, ...(args.status ? { status: args.status } : {}),
    ...(args.mergeFields ? { merge_fields: args.mergeFields } : {}), ...(args.language ? { language: args.language } : {}), ...(args.vip !== undefined ? { vip: args.vip } : {})
  } })));

  server.registerTool('mailchimp.member.archive', {
    description: 'Archive a member from an audience using the standard DELETE member endpoint. Risk: DESTRUCTIVE. Explicit approval required. This does not implement permanent deletion.',
    inputSchema: { audienceId: id, email: email, approvalToken }
  }, async args => run('mailchimp.member.archive', args, () => client.request('DELETE', `/lists/${encodeURIComponent(args.audienceId)}/members/${subscriberHash(args.email)}`)));

  server.registerTool('mailchimp.member.tags.update', {
    description: 'Add or remove tags for an audience member. Risk: WRITE. Explicit approval required.',
    inputSchema: {
      audienceId: id, email: email,
      tags: z.array(z.object({ name: z.string().min(1).max(100), status: z.enum(['active', 'inactive']) })).min(1).max(100),
      approvalToken
    }
  }, async args => run('mailchimp.member.tags.update', args, () => client.request('POST', `/lists/${encodeURIComponent(args.audienceId)}/members/${subscriberHash(args.email)}/tags`, { body: { tags: args.tags } })));

  server.registerTool('mailchimp.campaign.list', {
    description: 'List campaigns. Risk: READ. Approval: no.',
    inputSchema: { count, offset, status: z.enum(['save', 'paused', 'schedule', 'sending', 'sent']).optional(), listId: id.optional() }
  }, async args => run('mailchimp.campaign.list', args, () => client.request('GET', '/campaigns', { query: { count: args.count, offset: args.offset, status: args.status, list_id: args.listId } })));

  server.registerTool('mailchimp.campaign.get', {
    description: 'Get campaign metadata. Risk: READ. Approval: no.', inputSchema: { campaignId: id }
  }, async args => run('mailchimp.campaign.get', args, () => client.request('GET', `/campaigns/${encodeURIComponent(args.campaignId)}`)));

  server.registerTool('mailchimp.campaign.create', {
    description: 'Create a regular or plaintext campaign draft. Does not send it. Risk: WRITE. Explicit approval required.',
    inputSchema: {
      type: z.enum(['regular', 'plaintext']), audienceId: id,
      subjectLine: z.string().min(1).max(150), previewText: z.string().max(150).optional(),
      title: z.string().max(255).optional(), fromName: z.string().min(1).max(255), replyTo: email,
      toName: z.string().max(255).optional(), approvalToken
    }
  }, async args => run('mailchimp.campaign.create', args, () => client.request('POST', '/campaigns', { body: {
    type: args.type, recipients: { list_id: args.audienceId }, settings: {
      subject_line: args.subjectLine, ...(args.previewText ? { preview_text: args.previewText } : {}), ...(args.title ? { title: args.title } : {}),
      from_name: args.fromName, reply_to: args.replyTo, ...(args.toName ? { to_name: args.toName } : {})
    }
  } })));

  server.registerTool('mailchimp.campaign.update', {
    description: 'Update campaign settings or audience targeting. Does not send it. Risk: WRITE. Explicit approval required.',
    inputSchema: {
      campaignId: id, audienceId: id.optional(), subjectLine: z.string().min(1).max(150).optional(), previewText: z.string().max(150).optional(),
      title: z.string().max(255).optional(), fromName: z.string().min(1).max(255).optional(), replyTo: email.optional(), approvalToken
    }
  }, async args => run('mailchimp.campaign.update', args, () => {
    const settings = Object.fromEntries(Object.entries({ subject_line: args.subjectLine, preview_text: args.previewText, title: args.title, from_name: args.fromName, reply_to: args.replyTo }).filter(([, v]) => v !== undefined));
    if (!args.audienceId && Object.keys(settings).length === 0) throw new Error('At least one campaign field must be updated');
    return client.request('PATCH', `/campaigns/${encodeURIComponent(args.campaignId)}`, { body: {
      ...(args.audienceId ? { recipients: { list_id: args.audienceId } } : {}), ...(Object.keys(settings).length ? { settings } : {})
    } });
  }));

  server.registerTool('mailchimp.campaign.content.update', {
    description: 'Replace campaign content with HTML and/or plain text. Risk: WRITE. Explicit approval required.',
    inputSchema: { campaignId: id, html: z.string().max(500000).optional(), plainText: z.string().max(500000).optional(), approvalToken }
  }, async args => run('mailchimp.campaign.content.update', args, () => {
    if (!args.html && !args.plainText) throw new Error('html or plainText is required');
    return client.request('PUT', `/campaigns/${encodeURIComponent(args.campaignId)}/content`, { body: { ...(args.html ? { html: args.html } : {}), ...(args.plainText ? { plain_text: args.plainText } : {}) } });
  }));

  server.registerTool('mailchimp.campaign.send', {
    description: 'Send a Mailchimp campaign immediately. This publishes external email to recipients. Risk: HIGH_RISK. Explicit human approval required.',
    inputSchema: { campaignId: id, approvalToken }
  }, async args => run('mailchimp.campaign.send', args, () => client.request('POST', `/campaigns/${encodeURIComponent(args.campaignId)}/actions/send`)));

  server.registerTool('mailchimp.report.get', {
    description: 'Get a campaign report after sending. Risk: READ. Approval: no.', inputSchema: { campaignId: id }
  }, async args => run('mailchimp.report.get', args, () => client.request('GET', `/reports/${encodeURIComponent(args.campaignId)}`)));

  return server;
}

export async function main(): Promise<void> {
  const config = loadConfig();
  const server = buildServer(config);
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

export { TOOL_POLICY };
