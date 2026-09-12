import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { OnfleetClient } from "./client.js";
import type { Config } from "./config.js";
import { requireApproval, type Risk } from "./policy.js";

const Id = z.string().min(1).max(128);
const Approval = z.enum(["approved", "approved-high-risk"]).optional();
const E164 = z.string().regex(/^\+[1-9]\d{6,14}$/);
const Metadata = z.array(z.object({ name: z.string().min(1).max(128), type: z.enum(["string", "number", "boolean", "object"]), value: z.unknown() }).strict()).max(50).optional();
const WebhookTrigger = z.union([
  z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10),
  z.literal(12), z.literal(13), z.literal(14), z.literal(15), z.literal(16), z.literal(29), z.literal(30)
]);

function result(tool: string, risk: Risk, data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ provider: "Onfleet", tool, risk, untrusted_provider_content: true, data }, null, 2) }] };
}

function encode(value: string): string { return encodeURIComponent(value); }

function assertWebhookUrl(raw: string): string {
  const url = new URL(raw);
  if (url.protocol !== "https:") throw new Error("Webhook URL must use HTTPS");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) throw new Error("Webhook URL must not target a local/private address");
  return url.toString();
}

export const TOOL_NAMES = [
  "onfleet.task.list", "onfleet.task.get", "onfleet.task.create",
  "onfleet.worker.list", "onfleet.worker.get", "onfleet.worker.nearby", "onfleet.worker.schedule.get",
  "onfleet.team.list", "onfleet.recipient.find", "onfleet.route_plan.list",
  "onfleet.webhook.list", "onfleet.webhook.create", "onfleet.webhook.delete"
] as const;

export function registerTools(server: McpServer, client: OnfleetClient, config: Config): void {
  server.tool("onfleet.task.list", "List tasks with bounded server-side pagination filters. READ.", {
    from: z.number().int().nonnegative().optional(), to: z.number().int().nonnegative().optional(), state: z.enum(["0", "1", "2", "3"]).optional(), lastId: Id.optional()
  }, async (input, extra) => result("onfleet.task.list", "READ", await client.request("GET", "/tasks", { query: input, signal: extra.signal })));

  server.tool("onfleet.task.get", "Read one task including completion details, delay and tracking URL. READ.", { taskId: Id }, async ({ taskId }, extra) =>
    result("onfleet.task.get", "READ", await client.request("GET", `/tasks/${encode(taskId)}`, { signal: extra.signal })));

  server.tool("onfleet.task.create", "Create one Onfleet task. WRITE; explicit approval required.", {
    destination: z.union([Id, z.object({ address: z.object({ unparsed: z.string().min(3).max(500) }).strict(), notes: z.string().max(2000).optional() }).strict()]),
    recipients: z.array(z.union([Id, z.object({ name: z.string().min(1).max(200), phone: E164, notes: z.string().max(2000).optional(), skipSMSNotifications: z.boolean().optional() }).strict()])).min(1).max(20),
    pickupTask: z.boolean().optional(), notes: z.string().max(5000).optional(), completeAfter: z.number().int().nonnegative().optional(), completeBefore: z.number().int().nonnegative().optional(), metadata: Metadata, approval: Approval
  }, async ({ approval, ...body }, extra) => {
    requireApproval("WRITE", approval, config);
    return result("onfleet.task.create", "WRITE", await client.request("POST", "/tasks", { body, signal: extra.signal, retryable: false }));
  });

  server.tool("onfleet.worker.list", "List workers, optionally filtered by teams or state. READ. Password details are intentionally unsupported.", {
    teams: z.string().max(1000).optional(), states: z.string().regex(/^[012](,[012])*$/).optional(), phones: z.string().max(1000).optional(), filter: z.string().max(500).optional()
  }, async (input, extra) => result("onfleet.worker.list", "READ", await client.request("GET", "/workers", { query: input, signal: extra.signal })));

  server.tool("onfleet.worker.get", "Read one worker; optional analytics window is capped by Onfleet to 24 hours when from/to are supplied. READ.", {
    workerId: Id, analytics: z.boolean().optional(), from: z.number().int().nonnegative().optional(), to: z.number().int().nonnegative().optional(), filter: z.string().max(500).optional()
  }, async ({ workerId, ...query }, extra) => result("onfleet.worker.get", "READ", await client.request("GET", `/workers/${encode(workerId)}`, { query, signal: extra.signal })));

  server.tool("onfleet.worker.nearby", "Find workers near coordinates within up to 10km. READ.", {
    longitude: z.number().min(-180).max(180), latitude: z.number().min(-90).max(90), radius: z.number().int().min(1).max(10000).optional()
  }, async (query, extra) => result("onfleet.worker.nearby", "READ", await client.request("GET", "/workers/location", { query, signal: extra.signal })));

  server.tool("onfleet.worker.schedule.get", "Read schedule entries for one worker. READ.", { workerId: Id }, async ({ workerId }, extra) =>
    result("onfleet.worker.schedule.get", "READ", await client.request("GET", `/workers/${encode(workerId)}/schedule`, { signal: extra.signal })));

  server.tool("onfleet.team.list", "List teams and their worker/manager/hub associations. READ.", {}, async (_input, extra) =>
    result("onfleet.team.list", "READ", await client.request("GET", "/teams", { signal: extra.signal })));

  server.tool("onfleet.recipient.find", "Find a recipient by exact name or phone. READ.", {
    field: z.enum(["name", "phone"]), value: z.string().min(1).max(200), skipPhoneNumberValidation: z.boolean().optional()
  }, async ({ field, value, skipPhoneNumberValidation }, extra) => result("onfleet.recipient.find", "READ", await client.request("GET", `/recipients/${field}/${encode(value)}`, { query: { skipPhoneNumberValidation }, signal: extra.signal })));

  server.tool("onfleet.route_plan.list", "List route plans with server-side filters. READ.", {
    workerId: Id.optional(), startTimeFrom: z.number().int().nonnegative().optional(), startTimeTo: z.number().int().nonnegative().optional(), createdTimeFrom: z.number().int().nonnegative().optional(), createdTimeTo: z.number().int().nonnegative().optional(), hasTasks: z.boolean().optional(), limit: z.number().int().min(1).max(500).optional()
  }, async (query, extra) => result("onfleet.route_plan.list", "READ", await client.request("GET", "/routePlans", { query, signal: extra.signal })));

  server.tool("onfleet.webhook.list", "List configured webhooks and delivery counts. READ.", {}, async (_input, extra) =>
    result("onfleet.webhook.list", "READ", await client.request("GET", "/webhooks", { signal: extra.signal })));

  server.tool("onfleet.webhook.create", "Create a webhook for an allowlisted Onfleet trigger. HIGH_RISK because it sends organization event data to an external HTTPS endpoint.", {
    url: z.string().url().max(2048), name: z.string().min(1).max(200), trigger: WebhookTrigger, threshold: z.number().nonnegative().optional(), canReceiveConnectionEvents: z.boolean().optional(), approval: Approval
  }, async ({ approval, url, ...rest }, extra) => {
    requireApproval("HIGH_RISK", approval, config);
    return result("onfleet.webhook.create", "HIGH_RISK", await client.request("POST", "/webhooks", { body: { url: assertWebhookUrl(url), ...rest }, signal: extra.signal, retryable: false }));
  });

  server.tool("onfleet.webhook.delete", "Delete one webhook. DESTRUCTIVE; explicit high-risk approval required.", { webhookId: Id, approval: Approval }, async ({ webhookId, approval }, extra) => {
    requireApproval("DESTRUCTIVE", approval, config);
    return result("onfleet.webhook.delete", "DESTRUCTIVE", await client.request("DELETE", `/webhooks/${encode(webhookId)}`, { signal: extra.signal, retryable: false }));
  });
}
