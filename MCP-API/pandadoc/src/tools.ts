import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import { PandaDocClient } from "./client.js";
import { requireApproval, type Risk } from "./policy.js";

const approval = z.enum(["approved", "approved-high-risk"]).optional();
const id = z.string().min(8).max(128).regex(/^[A-Za-z0-9_-]+$/);
const count = z.number().int().min(1).max(100).default(50);
const page = z.number().int().min(1).default(1);

export interface ToolSpec { name: string; risk: Risk; purpose: string; }
export const TOOL_SPECS: ToolSpec[] = [
  { name: "pandadoc.template.list", risk: "READ", purpose: "Search and list templates." },
  { name: "pandadoc.template.get", risk: "READ", purpose: "Read template details including roles, fields, tokens and metadata." },
  { name: "pandadoc.document.list", risk: "READ", purpose: "Search and filter documents." },
  { name: "pandadoc.document.status", risk: "READ", purpose: "Read a document's current workflow status." },
  { name: "pandadoc.document.get", risk: "READ", purpose: "Read full document details." },
  { name: "pandadoc.document.create_from_template", risk: "WRITE", purpose: "Create a draft document asynchronously from a PandaDoc template." },
  { name: "pandadoc.document.send", risk: "HIGH_RISK", purpose: "Send a draft document to external recipients for viewing/signature." },
  { name: "pandadoc.document.remind", risk: "HIGH_RISK", purpose: "Send reminder notifications to document recipients." },
  { name: "pandadoc.webhook.list", risk: "READ", purpose: "List webhook subscriptions for the workspace." },
  { name: "pandadoc.webhook.get", risk: "READ", purpose: "Read one webhook subscription." },
  { name: "pandadoc.webhook.create", risk: "WRITE", purpose: "Create an HTTPS webhook subscription for allowlisted PandaDoc events." }
];

const webhookTriggers = z.enum([
  "document_deleted", "recipient_completed", "document_updated", "document_state_changed",
  "document_creation_failed", "document_completed_pdf_ready", "document_section_added", "quote_updated",
  "teamplate_created", "template_updated", "template_deleted"
]);

function output(tool: string, risk: Risk, result: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ provider: "PandaDoc", tool, risk, untrusted_provider_content: true, result }, null, 2) }] };
}

export function registerTools(server: McpServer, client: PandaDocClient, config: Config): void {
  server.tool("pandadoc.template.list", "Search/list PandaDoc templates. READ.", {
    q: z.string().min(1).max(200).optional(), tag: z.string().min(1).max(100).optional(), shared: z.boolean().optional(), count, page
  }, async (args) => output("pandadoc.template.list", "READ", await client.request("/templates", { query: args })));

  server.tool("pandadoc.template.get", "Get PandaDoc template details. READ.", { template_id: id },
    async ({ template_id }) => output("pandadoc.template.get", "READ", await client.request(`/templates/${template_id}/details`)));

  server.tool("pandadoc.document.list", "Search/list documents with bounded pagination. READ.", {
    q: z.string().min(1).max(200).optional(), tag: z.string().min(1).max(100).optional(), status: z.number().int().min(0).max(14).optional(),
    created_from: z.string().datetime().optional(), created_to: z.string().datetime().optional(), modified_from: z.string().datetime().optional(), modified_to: z.string().datetime().optional(), count, page
  }, async (args) => output("pandadoc.document.list", "READ", await client.request("/documents", { query: args })));

  server.tool("pandadoc.document.status", "Get current document status. READ.", { document_id: id },
    async ({ document_id }) => output("pandadoc.document.status", "READ", await client.request(`/documents/${document_id}`)));

  server.tool("pandadoc.document.get", "Get document details including recipients, fields and metadata. READ.", { document_id: id },
    async ({ document_id }) => output("pandadoc.document.get", "READ", await client.request(`/documents/${document_id}/details`)));

  server.tool("pandadoc.document.create_from_template", "Create a document from a template. WRITE; explicit approval required. Creation is asynchronous and initially returns document.uploaded.", {
    name: z.string().min(1).max(255), template_uuid: id,
    recipients: z.array(z.object({ email: z.string().email(), first_name: z.string().max(100).optional(), last_name: z.string().max(100).optional(), role: z.string().min(1).max(100).optional(), signing_order: z.number().int().min(1).optional() }).strict()).min(1).max(50),
    tokens: z.array(z.object({ name: z.string().min(1).max(200), value: z.union([z.string().max(10000), z.number(), z.boolean()]) }).strict()).max(200).optional(),
    fields: z.record(z.object({ value: z.union([z.string().max(10000), z.number(), z.boolean()]) }).strict()).optional(),
    metadata: z.record(z.union([z.string().max(1000), z.number(), z.boolean()])).optional(),
    tags: z.array(z.string().min(1).max(100)).max(50).optional(), approval
  }, async ({ approval: a, ...body }) => {
    requireApproval("WRITE", a, config);
    return output("pandadoc.document.create_from_template", "WRITE", await client.request("/documents", { method: "POST", body, retryable: false }));
  });

  server.tool("pandadoc.document.send", "Send a draft document to recipients. HIGH_RISK because it triggers external communication/signature workflow.", {
    document_id: id, message: z.string().max(5000).optional(), subject: z.string().max(255).optional(), silent: z.boolean().default(false), approval
  }, async ({ document_id, approval: a, ...body }) => {
    requireApproval("HIGH_RISK", a, config);
    return output("pandadoc.document.send", "HIGH_RISK", await client.request(`/documents/${document_id}/send`, { method: "POST", body, retryable: false }));
  });

  server.tool("pandadoc.document.remind", "Send email/SMS reminders to specified document recipients. HIGH_RISK external communication.", {
    document_id: id,
    reminders: z.array(z.object({
      recipient_id: id,
      delivery_methods: z.object({ email: z.boolean(), sms: z.boolean() }).strict().refine(v => v.email || v.sms, "At least one delivery method must be enabled"),
      email_customization: z.object({ subject: z.string().max(512).optional(), message: z.string().max(5000).optional() }).strict().optional()
    }).strict()).min(1).max(50),
    approval
  }, async ({ document_id, approval: a, reminders }) => {
    requireApproval("HIGH_RISK", a, config);
    return output("pandadoc.document.remind", "HIGH_RISK", await client.request(`/documents/${document_id}/send-reminder`, { method: "POST", body: { reminders }, retryable: false }));
  });

  server.tool("pandadoc.webhook.list", "List webhook subscriptions. READ.", {},
    async () => output("pandadoc.webhook.list", "READ", await client.request("/webhook-subscriptions")));

  server.tool("pandadoc.webhook.get", "Get one webhook subscription. READ.", { webhook_id: z.string().uuid() },
    async ({ webhook_id }) => output("pandadoc.webhook.get", "READ", await client.request(`/webhook-subscriptions/${webhook_id}`)));

  server.tool("pandadoc.webhook.create", "Create an HTTPS webhook subscription. WRITE; explicit approval required.", {
    name: z.string().min(1).max(255),
    url: z.string().url().refine(value => new URL(value).protocol === "https:", "Webhook URL must use HTTPS"),
    active: z.boolean().default(true),
    triggers: z.array(webhookTriggers).min(1).max(13),
    payload: z.array(z.enum(["metadata", "fields", "products", "tokens", "pricing"])).max(5).optional(),
    approval
  }, async ({ approval: a, ...body }) => {
    requireApproval("WRITE", a, config);
    return output("pandadoc.webhook.create", "WRITE", await client.request("/webhook-subscriptions", { method: "POST", body, retryable: false }));
  });
}
