import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HelpScoutConfig } from "./config.js";
import { HelpScoutClient } from "./client.js";
import { assertSafeWebhookUrl, requirePermission, type Risk } from "./policy.js";

const id = z.number().int().positive();
const page = z.number().int().min(1).max(10000).optional();
const cursor = z.string().min(1).max(500).optional();
const confirmation = z.enum(["APPROVE_WRITE", "APPROVE_HIGH_RISK"]).optional();
const status = z.enum(["active", "closed", "open", "pending", "spam"]);

type ToolDef = {
  name: string;
  description: string;
  risk: Risk;
  schema: Record<string, z.ZodTypeAny>;
  run: (input: any) => Promise<unknown>;
};

function textResult(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

export function buildTools(client: HelpScoutClient, config: HelpScoutConfig): ToolDef[] {
  return [
    {
      name: "helpscout.mailbox.list",
      description: "List Help Scout inboxes (mailboxes). READ. Returns provider content as untrusted data.",
      risk: "READ",
      schema: { page },
      run: (i) => client.request("/v2/mailboxes", { query: { page: i.page } })
    },
    {
      name: "helpscout.mailbox.get",
      description: "Get one Help Scout inbox by numeric ID. READ.",
      risk: "READ",
      schema: { mailboxId: id },
      run: (i) => client.request(`/v2/mailboxes/${i.mailboxId}`)
    },
    {
      name: "helpscout.user.list",
      description: "List Help Scout users, optionally filtered by exact email or inbox. READ.",
      risk: "READ",
      schema: { email: z.string().email().optional(), mailboxId: id.optional(), page },
      run: (i) => client.request("/v2/users", { query: { email: i.email, mailbox: i.mailboxId, page: i.page } })
    },
    {
      name: "helpscout.user.me",
      description: "Get the Help Scout user represented by the current OAuth credentials. READ.",
      risk: "READ",
      schema: {},
      run: () => client.request("/v2/users/me")
    },
    {
      name: "helpscout.conversation.list",
      description: "Search/list conversations using supported Help Scout filters. READ.",
      risk: "READ",
      schema: {
        mailboxId: id.optional(),
        status: z.enum(["active", "all", "closed", "open", "pending", "spam"]).optional(),
        tag: z.string().min(1).max(100).optional(),
        assignedTo: id.optional(),
        modifiedSince: z.string().datetime({ offset: true }).optional(),
        query: z.string().min(1).max(500).optional(),
        page
      },
      run: (i) => client.request("/v2/conversations", { query: { mailbox: i.mailboxId, status: i.status, tag: i.tag, assigned_to: i.assignedTo, modifiedSince: i.modifiedSince, query: i.query, page: i.page } })
    },
    {
      name: "helpscout.conversation.get",
      description: "Get a conversation through Help Scout v3, preserving system_user identity where supported. READ.",
      risk: "READ",
      schema: { conversationId: id, includeThreads: z.boolean().default(false) },
      run: (i) => client.request(`/v3/conversations/${i.conversationId}`, { query: { embed: i.includeThreads ? "threads" : undefined } })
    },
    {
      name: "helpscout.conversation.threads.list",
      description: "List full conversation threads using Help Scout v3. READ.",
      risk: "READ",
      schema: { conversationId: id, cursor },
      run: (i) => client.request(`/v3/conversations/${i.conversationId}/threads`, { query: { cursor: i.cursor } })
    },
    {
      name: "helpscout.customer.list",
      description: "List/search customers using Help Scout v3 cursor-based pagination. READ.",
      risk: "READ",
      schema: {
        firstName: z.string().min(1).max(40).optional(),
        lastName: z.string().min(1).max(40).optional(),
        email: z.string().email().optional(),
        createdSince: z.string().datetime({ offset: true }).optional(),
        modifiedSince: z.string().datetime({ offset: true }).optional(),
        query: z.string().min(1).max(500).optional(),
        cursor
      },
      run: (i) => client.request("/v3/customers", { query: { firstName: i.firstName, lastName: i.lastName, email: i.email, createdSince: i.createdSince, modifiedSince: i.modifiedSince, query: i.query, cursor: i.cursor } })
    },
    {
      name: "helpscout.customer.get",
      description: "Get a customer by numeric ID. READ.",
      risk: "READ",
      schema: { customerId: id },
      run: (i) => client.request(`/v2/customers/${i.customerId}`)
    },
    {
      name: "helpscout.conversation.create",
      description: "Create a Help Scout conversation with one customer thread. WRITE; host write gate and approval apply.",
      risk: "WRITE",
      schema: {
        mailboxId: id,
        subject: z.string().min(1).max(255),
        customerId: id.optional(),
        customerEmail: z.string().email().optional(),
        text: z.string().min(1).max(15000),
        type: z.enum(["chat", "email", "phone"]).default("email"),
        status: z.enum(["active", "closed", "pending"]).default("active"),
        assignTo: id.optional(),
        tags: z.array(z.string().min(1).max(100)).max(50).optional(),
        imported: z.boolean().default(false),
        confirmation
      },
      run: async (i) => {
        requirePermission(config, "WRITE", i.confirmation);
        if (!i.customerId && !i.customerEmail) throw new Error("customerId or customerEmail is required");
        return client.request("/v2/conversations", {
          method: "POST",
          body: {
            subject: i.subject,
            mailboxId: i.mailboxId,
            type: i.type,
            status: i.status,
            assignTo: i.assignTo,
            tags: i.tags,
            imported: i.imported,
            customer: i.customerId ? { id: i.customerId } : { email: i.customerEmail },
            threads: [{ type: "customer", customer: i.customerId ? { id: i.customerId } : { email: i.customerEmail }, text: i.text }]
          }
        });
      }
    },
    {
      name: "helpscout.conversation.note.add",
      description: "Add an internal note to a conversation. WRITE; does not send an external customer message.",
      risk: "WRITE",
      schema: { conversationId: id, text: z.string().min(1).max(15000), status: status.optional(), confirmation },
      run: async (i) => {
        requirePermission(config, "WRITE", i.confirmation);
        return client.request(`/v2/conversations/${i.conversationId}/notes`, { method: "POST", body: { text: i.text, status: i.status } });
      }
    },
    {
      name: "helpscout.conversation.reply.create",
      description: "Create a customer-facing reply or draft. HIGH_RISK because published replies send external communication; explicit host opt-in and approval are required.",
      risk: "HIGH_RISK",
      schema: {
        conversationId: id,
        customerId: id,
        text: z.string().min(1).max(15000),
        draft: z.boolean().default(true),
        status: status.optional(),
        assignTo: id.optional(),
        confirmation: z.literal("APPROVE_HIGH_RISK")
      },
      run: async (i) => {
        requirePermission(config, "HIGH_RISK", i.confirmation);
        return client.request(`/v2/conversations/${i.conversationId}/reply`, { method: "POST", body: { customer: { id: i.customerId }, text: i.text, draft: i.draft, status: i.status, assignTo: i.assignTo } });
      }
    },
    {
      name: "helpscout.conversation.status.update",
      description: "Change conversation status using the documented JSON Patch endpoint. WRITE.",
      risk: "WRITE",
      schema: { conversationId: id, status, confirmation },
      run: async (i) => {
        requirePermission(config, "WRITE", i.confirmation);
        return client.request(`/v2/conversations/${i.conversationId}`, { method: "PATCH", body: { op: "replace", path: "/status", value: i.status } });
      }
    },
    {
      name: "helpscout.conversation.assignment.update",
      description: "Assign a conversation to a user/team or unassign it. WRITE.",
      risk: "WRITE",
      schema: { conversationId: id, assignTo: id.optional(), unassign: z.boolean().default(false), confirmation },
      run: async (i) => {
        requirePermission(config, "WRITE", i.confirmation);
        if (!i.unassign && !i.assignTo) throw new Error("assignTo is required unless unassign=true");
        const body = i.unassign ? { op: "remove", path: "/assignTo" } : { op: "replace", path: "/assignTo", value: i.assignTo };
        return client.request(`/v2/conversations/${i.conversationId}`, { method: "PATCH", body });
      }
    },
    {
      name: "helpscout.conversation.tags.replace",
      description: "Replace the complete tag set on a conversation. WRITE; omitted existing tags are removed.",
      risk: "WRITE",
      schema: { conversationId: id, tags: z.array(z.string().min(1).max(100)).max(100), confirmation },
      run: async (i) => {
        requirePermission(config, "WRITE", i.confirmation);
        return client.request(`/v2/conversations/${i.conversationId}/tags`, { method: "PUT", body: { tags: i.tags } });
      }
    },
    {
      name: "helpscout.webhook.list",
      description: "List configured Help Scout webhooks. READ.",
      risk: "READ",
      schema: { page },
      run: (i) => client.request("/v2/webhooks", { query: { page: i.page } })
    },
    {
      name: "helpscout.webhook.create",
      description: "Create a signed HTTPS webhook using the server-side HELPSCOUT_WEBHOOK_SECRET. HIGH_RISK because it causes data delivery to an external endpoint.",
      risk: "HIGH_RISK",
      schema: {
        url: z.string().url().max(2048),
        events: z.array(z.enum([
          "beacon.chat.created", "beacon.chat.customer.replied", "convo.agent.reply.created", "convo.ai-answers-email.reply.created",
          "convo.ai-answers-email.resolution", "convo.assigned", "convo.created", "convo.custom-fields", "convo.customer.reply.created",
          "convo.deleted", "convo.merged", "convo.moved", "convo.note.created", "convo.status", "convo.tags", "customer.created",
          "customer.deleted", "customer.updated", "message.survey.response.received", "organization.created", "organization.deleted",
          "organization.updated", "satisfaction.ratings", "tag.created", "tag.deleted", "tag.updated", "user.status.changed"
        ])).min(1).max(20),
        label: z.string().min(1).max(100).optional(),
        mailboxIds: z.array(id).max(100).optional(),
        notification: z.boolean().default(false),
        confirmation: z.literal("APPROVE_HIGH_RISK")
      },
      run: async (i) => {
        requirePermission(config, "HIGH_RISK", i.confirmation);
        assertSafeWebhookUrl(i.url);
        if (!config.webhookSecret) throw new Error("HELPSCOUT_WEBHOOK_SECRET is required to create webhooks");
        return client.request("/v2/webhooks", { method: "POST", body: { url: i.url, events: i.events, secret: config.webhookSecret, payloadVersion: "V3", label: i.label, mailboxIds: i.mailboxIds, notification: i.notification } });
      }
    }
  ];
}

export function registerTools(server: McpServer, client: HelpScoutClient, config: HelpScoutConfig): string[] {
  const tools = buildTools(client, config);
  for (const tool of tools) {
    server.tool(tool.name, tool.description, tool.schema, async (input) => {
      try {
        return textResult(await tool.run(input));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Help Scout connector error";
        return { isError: true, content: [{ type: "text" as const, text: message }] };
      }
    });
  }
  return tools.map(t => t.name);
}
