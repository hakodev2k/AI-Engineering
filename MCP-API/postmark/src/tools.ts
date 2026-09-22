import { z } from 'zod';
import { PostmarkClient } from './client.js';
import { requireApproval, type Risk } from './security.js';

const approval = { approved: z.boolean().optional() };
const paging = { count: z.number().int().min(1).max(500).default(50), offset: z.number().int().min(0).default(0) };
const id = z.string().min(1).max(200);
const email = z.string().email();

export interface ToolDef { name: string; description: string; risk: Risk; schema: z.ZodTypeAny; run: (input: any, signal?: AbortSignal) => Promise<unknown>; }
export function createTools(client: PostmarkClient, requireWriteApproval = true): ToolDef[] {
  const tool = (name: string, description: string, risk: Risk, schema: z.ZodTypeAny, fn: (v: any, s?: AbortSignal) => Promise<unknown>): ToolDef => ({ name, description, risk, schema, run: async (raw, signal) => { const v = schema.parse(raw); requireApproval(risk, v.approved, requireWriteApproval); return fn(v, signal); } });
  return [
    tool('postmark.message.send','Send one transactional email. External message; explicit approval required.','HIGH_RISK',z.object({from:email,to:email,subject:z.string().min(1).max(2000),textBody:z.string().max(5_000_000).optional(),htmlBody:z.string().max(5_000_000).optional(),messageStream:id.default('outbound'),...approval}).strict().refine(v=>v.textBody||v.htmlBody,'A body is required'),(v,s)=>client.request('POST','/email',{From:v.from,To:v.to,Subject:v.subject,TextBody:v.textBody,HtmlBody:v.htmlBody,MessageStream:v.messageStream},s)),
    tool('postmark.message.send_template','Send one email using a Postmark template alias. External message; explicit approval required.','HIGH_RISK',z.object({from:email,to:email,templateAlias:id,templateModel:z.record(z.unknown()),messageStream:id.default('outbound'),...approval}).strict(),(v,s)=>client.request('POST','/email/withTemplate',{From:v.from,To:v.to,TemplateAlias:v.templateAlias,TemplateModel:v.templateModel,MessageStream:v.messageStream},s)),
    tool('postmark.message.outbound.list','List outbound messages with bounded pagination.','READ',z.object({...paging,recipient:email.optional(),tag:z.string().max(1000).optional(),messageStream:id.optional()}).strict(),(v,s)=>client.request('GET',`/messages/outbound?count=${v.count}&offset=${v.offset}${v.recipient?`&recipient=${encodeURIComponent(v.recipient)}`:''}${v.tag?`&tag=${encodeURIComponent(v.tag)}`:''}${v.messageStream?`&messagestream=${encodeURIComponent(v.messageStream)}`:''}`,undefined,s)),
    tool('postmark.message.outbound.get','Get outbound message details and event history.','READ',z.object({messageId:id}).strict(),(v,s)=>client.request('GET',`/messages/outbound/${encodeURIComponent(v.messageId)}/details`,undefined,s)),
    tool('postmark.bounce.list','List bounces with bounded pagination.','READ',z.object({...paging,inactive:z.boolean().optional(),messageStream:id.optional()}).strict(),(v,s)=>client.request('GET',`/bounces?count=${v.count}&offset=${v.offset}${v.inactive===undefined?'':`&inactive=${v.inactive}`}${v.messageStream?`&messagestream=${encodeURIComponent(v.messageStream)}`:''}`,undefined,s)),
    tool('postmark.bounce.get','Get a bounce by numeric ID.','READ',z.object({bounceId:z.number().int().positive()}).strict(),(v,s)=>client.request('GET',`/bounces/${v.bounceId}`,undefined,s)),
    tool('postmark.template.list','List templates.','READ',z.object({...paging,templateType:z.enum(['Standard','Layout']).optional()}).strict(),(v,s)=>client.request('GET',`/templates?Count=${v.count}&Offset=${v.offset}${v.templateType?`&TemplateType=${v.templateType}`:''}`,undefined,s)),
    tool('postmark.template.get','Get a template by ID or alias.','READ',z.object({templateIdOrAlias:id}).strict(),(v,s)=>client.request('GET',`/templates/${encodeURIComponent(v.templateIdOrAlias)}`,undefined,s)),
    tool('postmark.message_stream.list','List message streams.','READ',z.object({messageStreamType:z.enum(['Transactional','Broadcasts']).optional(),includeArchived:z.boolean().default(false)}).strict(),(v,s)=>client.request('GET',`/message-streams?IncludeArchivedStreams=${v.includeArchived}${v.messageStreamType?`&MessageStreamType=${v.messageStreamType}`:''}`,undefined,s)),
    tool('postmark.message_stream.get','Get a message stream.','READ',z.object({streamId:id}).strict(),(v,s)=>client.request('GET',`/message-streams/${encodeURIComponent(v.streamId)}`,undefined,s)),
    tool('postmark.webhook.list','List webhooks, optionally by message stream.','READ',z.object({messageStream:id.optional()}).strict(),(v,s)=>client.request('GET',`/webhooks${v.messageStream?`?MessageStream=${encodeURIComponent(v.messageStream)}`:''}`,undefined,s)),
    tool('postmark.webhook.get','Get a webhook configuration.','READ',z.object({webhookId:z.number().int().positive()}).strict(),(v,s)=>client.request('GET',`/webhooks/${v.webhookId}`,undefined,s)),
    tool('postmark.webhook.statistics','Get rolling 24-hour webhook delivery statistics.','READ',z.object({webhookId:z.number().int().positive()}).strict(),(v,s)=>client.request('GET',`/webhooks/${v.webhookId}/statistics`,undefined,s)),
    tool('postmark.suppression.list','List suppressions for a message stream.','READ',z.object({streamId:id,suppressionReason:z.enum(['HardBounce','SpamComplaint','ManualSuppression']).optional(),origin:z.string().max(100).optional()}).strict(),(v,s)=>client.request('GET',`/message-streams/${encodeURIComponent(v.streamId)}/suppressions/dump?${v.suppressionReason?`SuppressionReason=${v.suppressionReason}`:''}${v.origin?`&Origin=${encodeURIComponent(v.origin)}`:''}`,undefined,s)),
    tool('postmark.suppression.create','Suppress one or more recipients (max 50).','WRITE',z.object({streamId:id,emailAddresses:z.array(email).min(1).max(50),...approval}).strict(),(v,s)=>client.request('POST',`/message-streams/${encodeURIComponent(v.streamId)}/suppressions`,{Suppressions:v.emailAddresses.map((EmailAddress:string)=>({EmailAddress}))},s))
  ];
}
