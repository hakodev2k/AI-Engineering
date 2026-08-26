import { z } from 'zod';
import type { Config } from './config.js';
import { assertApproval } from './policy.js';
import type { Upstream } from './upstream.js';

export const emailAddress = z.string().email().max(320);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const approval = z.string().regex(/^[a-f0-9]{64}$/).optional();

export const schemas = {
  empty: z.object({}).strict(),
  emailSearch: z.object({
    recipient: emailAddress.optional(), fromEmail: emailAddress.optional(), tag: z.string().max(100).optional(),
    subject: z.string().max(500).optional(), status: z.enum(['queued','sent','processed']).optional(),
    messageStream: z.string().max(100).optional(), fromDate: date.optional(), toDate: date.optional(),
    count: z.number().int().min(1).max(500).default(50), offset: z.number().int().min(0).default(0)
  }).strict(),
  messageGet: z.object({ messageId: z.string().uuid() }).strict(),
  diagnose: z.object({ recipient: emailAddress, messageId: z.string().uuid().optional(), fromDate: date.optional(), toDate: date.optional(), messageStream: z.string().max(100).optional() }).strict(),
  stats: z.object({ stat: z.enum(['summary','overview','sent','bounces','spam','tracked','opens','openPlatforms','openClients','openReadTimes','clicks','clickBrowsers','clickPlatforms','clickLocation']).default('summary'), tag: z.string().max(100).optional(), fromDate: date.optional(), toDate: date.optional(), messageStream: z.string().max(100).optional() }).strict(),
  templateGet: z.object({ templateIdOrAlias: z.union([z.number().int().positive(), z.string().min(1).max(100)]) }).strict(),
  emailSend: z.object({
    to: z.union([emailAddress, z.array(emailAddress).min(1).max(50)]), subject: z.string().min(1).max(1000),
    textBody: z.string().max(2_000_000).optional(), htmlBody: z.string().max(5_000_000).optional(),
    from: emailAddress.optional(), cc: z.string().max(5000).optional(), bcc: z.string().max(5000).optional(), replyTo: emailAddress.optional(), tag: z.string().max(100).optional(), approval
  }).refine(v => !!v.textBody || !!v.htmlBody, 'textBody or htmlBody is required').strict(),
  templateSend: z.object({
    to: z.union([emailAddress, z.array(emailAddress).min(1).max(50)]), templateId: z.number().int().positive().optional(), templateAlias: z.string().min(1).max(100).optional(),
    templateModel: z.record(z.unknown()).default({}), from: emailAddress.optional(), tag: z.string().max(100).optional(), approval
  }).refine(v => Number(!!v.templateId) + Number(!!v.templateAlias) === 1, 'exactly one of templateId or templateAlias is required').strict(),
  webhookList: z.object({ messageStream: z.string().max(100).optional() }).strict(),
  webhookCreate: z.object({
    url: z.string().url(), messageStream: z.string().max(100).optional(), openEnabled: z.boolean().optional(), clickEnabled: z.boolean().optional(), deliveryEnabled: z.boolean().optional(), bounceEnabled: z.boolean().optional(), spamComplaintEnabled: z.boolean().optional(), subscriptionChangeEnabled: z.boolean().optional(), approval
  }).refine(v => [v.openEnabled,v.clickEnabled,v.deliveryEnabled,v.bounceEnabled,v.spamComplaintEnabled,v.subscriptionChangeEnabled].some(Boolean), 'at least one webhook trigger must be enabled').strict(),
  webhookDelete: z.object({ webhookId: z.number().int().positive(), approval }).strict()
};

function recipients(value: string | string[]): string[] { return Array.isArray(value) ? value : [value]; }

export function assertRecipientsAllowed(config: Config, value: string | string[]): void {
  if (!config.recipientDomainAllowlist.length) return;
  for (const address of recipients(value)) {
    const domain = address.split('@')[1]?.toLowerCase();
    if (!domain || !config.recipientDomainAllowlist.includes(domain)) throw new Error(`Recipient domain is not allowlisted: ${domain ?? 'invalid'}`);
  }
}

export function assertWebhookAllowed(config: Config, value: string): void {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Webhook URL must use HTTPS');
  if (config.webhookUrlAllowlist.length && !config.webhookUrlAllowlist.some(prefix => value.toLowerCase().startsWith(prefix))) throw new Error('Webhook URL is not allowlisted');
}

export async function invoke(upstream: Upstream, config: Config, tool: string, upstreamTool: string, args: Record<string, unknown>): Promise<unknown> {
  assertApproval(config.approvalSecret, tool, args, typeof args.approval === 'string' ? args.approval : undefined);
  const clean = { ...args };
  delete clean.approval;
  if (tool === 'postmark.email.send' || tool === 'postmark.template.send') assertRecipientsAllowed(config, clean.to as string | string[]);
  if (tool === 'postmark.webhook.create') assertWebhookAllowed(config, clean.url as string);
  return upstream.call(upstreamTool, clean);
}
