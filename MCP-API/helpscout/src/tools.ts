import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.number().int().positive();
const page = z.number().int().min(1).max(10_000).optional();
const status = z.enum(["active", "closed", "pending", "spam"]);
const threadStatus = z.enum(["active", "closed", "inbox_predefined", "open", "pending", "spam"]);
const email = z.string().email().max(254);
const text = z.string().min(1).max(50_000);
const tags = z.array(z.string().min(1).max(100)).max(50);
const empty = z.object({}).strict();

const webhookUrl = z.string().url().superRefine((value, ctx) => {
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  const privateV4 = /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
  if (url.protocol !== "https:" || host === "localhost" || host === "::1" || privateV4 || host.endsWith(".local")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Webhook URL must be a public HTTPS endpoint." });
  }
});

const webhookEvent = z.enum([
  "convo.assigned", "convo.created", "convo.deleted", "convo.merged", "convo.moved",
  "convo.note.created", "convo.status", "convo.tags", "convo.agent.reply.created",
  "convo.customer.reply.created", "customer.created", "customer.deleted", "customer.updated",
  "satisfaction.ratings", "tag.created", "tag.deleted", "tag.updated", "user.status.changed"
]);

const objectSchema = (properties: Record<string, unknown>, required: string[] = []) => ({
  type: "object",
  additionalProperties: false,
  properties,
  ...(required.length ? { required } : {})
});

export interface ToolDefinition {
  name: string;
  purpose: string;
  permission: "read" | "write" | "high_risk" | "destructive";
  risk: Risk;
  approval: "none" | "configurable" | "required" | "disabled_by_default";
  output: string;
  errors: string[];
  schema: z.ZodTypeAny;
  inputSchema: Record<string, unknown>;
}

const commonErrors = ["validation_error", "authentication_error", "permission_error", "rate_limited", "provider_error", "timeout"];

export const TOOLS: ToolDefinition[] = [
  { name: "helpscout.inbox.list", purpose: "List accessible Help Scout inboxes.", permission: "read", risk: "READ", approval: "none", output: "HAL inbox collection plus rate-limit metadata.", errors: commonErrors, schema: z.object({ page }).strict(), inputSchema: objectSchema({ page: { type: "integer", minimum: 1 } }) },
  { name: "helpscout.inbox.get", purpose: "Read one inbox by ID.", permission: "read", risk: "READ", approval: "none", output: "Inbox object plus rate-limit metadata.", errors: commonErrors, schema: z.object({ inboxId: id }).strict(), inputSchema: objectSchema({ inboxId: { type: "integer", minimum: 1 } }, ["inboxId"]) },
  { name: "helpscout.conversation.list", purpose: "Search/list conversations with bounded filters.", permission: "read", risk: "READ", approval: "none", output: "HAL conversation collection plus pagination/rate metadata.", errors: commonErrors, schema: z.object({ mailbox: id.optional(), status: z.enum(["active", "closed", "pending", "spam", "all"]).optional(), query: z.string().min(1).max(500).optional(), page }).strict(), inputSchema: objectSchema({ mailbox: { type: "integer", minimum: 1 }, status: { type: "string", enum: ["active", "closed", "pending", "spam", "all"] }, query: { type: "string", minLength: 1, maxLength: 500 }, page: { type: "integer", minimum: 1 } }) },
  { name: "helpscout.conversation.get", purpose: "Read a conversation using API v3 so AI system-user types are preserved.", permission: "read", risk: "READ", approval: "none", output: "Conversation v3 object plus rate metadata.", errors: commonErrors, schema: z.object({ conversationId: id }).strict(), inputSchema: objectSchema({ conversationId: { type: "integer", minimum: 1 } }, ["conversationId"]) },
  { name: "helpscout.conversation.threads.list", purpose: "List conversation threads using API v3.", permission: "read", risk: "READ", approval: "none", output: "HAL thread collection plus pagination/rate metadata.", errors: commonErrors, schema: z.object({ conversationId: id, page }).strict(), inputSchema: objectSchema({ conversationId: { type: "integer", minimum: 1 }, page: { type: "integer", minimum: 1 } }, ["conversationId"]) },
  { name: "helpscout.customer.list", purpose: "Search/list customers.", permission: "read", risk: "READ", approval: "none", output: "HAL customer collection plus pagination/rate metadata.", errors: commonErrors, schema: z.object({ mailbox: id.optional(), firstName: z.string().max(40).optional(), lastName: z.string().max(40).optional(), query: z.string().min(1).max(500).optional(), page }).strict(), inputSchema: objectSchema({ mailbox: { type: "integer", minimum: 1 }, firstName: { type: "string", maxLength: 40 }, lastName: { type: "string", maxLength: 40 }, query: { type: "string", minLength: 1, maxLength: 500 }, page: { type: "integer", minimum: 1 } }) },
  { name: "helpscout.customer.get", purpose: "Read a customer by ID.", permission: "read", risk: "READ", approval: "none", output: "Customer object plus rate metadata.", errors: commonErrors, schema: z.object({ customerId: id }).strict(), inputSchema: objectSchema({ customerId: { type: "integer", minimum: 1 } }, ["customerId"]) },
  { name: "helpscout.user.list", purpose: "List users, optionally filtered by exact email or inbox.", permission: "read", risk: "READ", approval: "none", output: "HAL user collection plus rate metadata.", errors: commonErrors, schema: z.object({ email: email.optional(), mailbox: id.optional(), page }).strict(), inputSchema: objectSchema({ email: { type: "string", format: "email" }, mailbox: { type: "integer", minimum: 1 }, page: { type: "integer", minimum: 1 } }) },
  { name: "helpscout.team.list", purpose: "List teams for assignment discovery.", permission: "read", risk: "READ", approval: "none", output: "HAL team collection plus rate metadata.", errors: commonErrors, schema: z.object({ page }).strict(), inputSchema: objectSchema({ page: { type: "integer", minimum: 1 } }) },
  { name: "helpscout.conversation.note.create", purpose: "Add an internal note to a conversation; does not send an external message.", permission: "write", risk: "WRITE", approval: "configurable", output: "Created thread Resource-Id plus rate metadata.", errors: commonErrors, schema: z.object({ conversationId: id, text, status: threadStatus.optional() }).strict(), inputSchema: objectSchema({ conversationId: { type: "integer", minimum: 1 }, text: { type: "string", minLength: 1, maxLength: 50000 }, status: { type: "string", enum: threadStatus.options } }, ["conversationId", "text"]) },
  { name: "helpscout.conversation.reply.draft.create", purpose: "Prepare a draft reply without sending it.", permission: "write", risk: "WRITE", approval: "configurable", output: "Created draft thread Resource-Id plus rate metadata.", errors: commonErrors, schema: z.object({ conversationId: id, customerId: id, text, status: threadStatus.optional(), cc: z.array(email).max(20).optional(), bcc: z.array(email).max(20).optional() }).strict(), inputSchema: objectSchema({ conversationId: { type: "integer", minimum: 1 }, customerId: { type: "integer", minimum: 1 }, text: { type: "string", minLength: 1, maxLength: 50000 }, status: { type: "string", enum: threadStatus.options }, cc: { type: "array", maxItems: 20, items: { type: "string", format: "email" } }, bcc: { type: "array", maxItems: 20, items: { type: "string", format: "email" } } }, ["conversationId", "customerId", "text"]) },
  { name: "helpscout.conversation.reply.send", purpose: "Send a reply to the customer; external communication requires explicit approval.", permission: "high_risk", risk: "HIGH_RISK", approval: "required", output: "Created reply Resource-Id plus rate metadata.", errors: commonErrors, schema: z.object({ conversationId: id, customerId: id, text, status: threadStatus.optional(), assignTo: z.number().int().min(2).optional(), cc: z.array(email).max(20).optional(), bcc: z.array(email).max(20).optional() }).strict(), inputSchema: objectSchema({ conversationId: { type: "integer", minimum: 1 }, customerId: { type: "integer", minimum: 1 }, text: { type: "string", minLength: 1, maxLength: 50000 }, status: { type: "string", enum: threadStatus.options }, assignTo: { type: "integer", minimum: 2 }, cc: { type: "array", maxItems: 20, items: { type: "string", format: "email" } }, bcc: { type: "array", maxItems: 20, items: { type: "string", format: "email" } } }, ["conversationId", "customerId", "text"]) },
  { name: "helpscout.conversation.status.update", purpose: "Change a conversation status through the documented JSON Patch path.", permission: "write", risk: "WRITE", approval: "configurable", output: "204 success metadata.", errors: commonErrors, schema: z.object({ conversationId: id, status }).strict(), inputSchema: objectSchema({ conversationId: { type: "integer", minimum: 1 }, status: { type: "string", enum: status.options } }, ["conversationId", "status"]) },
  { name: "helpscout.conversation.assign", purpose: "Assign a conversation to a user or team ID.", permission: "write", risk: "WRITE", approval: "configurable", output: "204 success metadata.", errors: commonErrors, schema: z.object({ conversationId: id, assigneeId: z.number().int().min(2) }).strict(), inputSchema: objectSchema({ conversationId: { type: "integer", minimum: 1 }, assigneeId: { type: "integer", minimum: 2 } }, ["conversationId", "assigneeId"]) },
  { name: "helpscout.conversation.unassign", purpose: "Remove the current conversation owner.", permission: "write", risk: "WRITE", approval: "configurable", output: "204 success metadata.", errors: commonErrors, schema: z.object({ conversationId: id }).strict(), inputSchema: objectSchema({ conversationId: { type: "integer", minimum: 1 } }, ["conversationId"]) },
  { name: "helpscout.conversation.tags.replace", purpose: "Replace the complete tag set on a conversation; omitted existing tags are removed.", permission: "write", risk: "WRITE", approval: "configurable", output: "204 success metadata.", errors: commonErrors, schema: z.object({ conversationId: id, tags }).strict(), inputSchema: objectSchema({ conversationId: { type: "integer", minimum: 1 }, tags: { type: "array", maxItems: 50, items: { type: "string", minLength: 1, maxLength: 100 } } }, ["conversationId", "tags"]) },
  { name: "helpscout.webhook.list", purpose: "List configured webhooks.", permission: "read", risk: "READ", approval: "none", output: "HAL webhook collection plus rate metadata.", errors: commonErrors, schema: z.object({ page }).strict(), inputSchema: objectSchema({ page: { type: "integer", minimum: 1 } }) },
  { name: "helpscout.webhook.create", purpose: "Create a signed webhook to a validated public HTTPS callback. Secret is connector-side only.", permission: "high_risk", risk: "HIGH_RISK", approval: "required", output: "Created webhook Resource-Id/location plus rate metadata.", errors: [...commonErrors, "webhook_secret_missing"], schema: z.object({ url: webhookUrl, events: z.array(webhookEvent).min(1).max(18), label: z.string().min(1).max(100).optional(), mailboxIds: z.array(id).max(100).optional(), notification: z.boolean().optional() }).strict(), inputSchema: objectSchema({ url: { type: "string", format: "uri", pattern: "^https://" }, events: { type: "array", minItems: 1, maxItems: 18, items: { type: "string", enum: webhookEvent.options } }, label: { type: "string", minLength: 1, maxLength: 100 }, mailboxIds: { type: "array", maxItems: 100, items: { type: "integer", minimum: 1 } }, notification: { type: "boolean" } }, ["url", "events"]) }
];

export const TOOL_MAP = new Map(TOOLS.map(tool => [tool.name, tool]));
