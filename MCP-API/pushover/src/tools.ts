import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import type { PushoverClient } from "./client.js";
import { requireApproval, type Risk } from "./policy.js";

export interface ToolSpec { name: string; description: string; risk: Risk; }
export const TOOL_SPECS: ToolSpec[] = [
  { name: "pushover.user.validate", description: "Validate a Pushover user/group key and optional device.", risk: "READ" },
  { name: "pushover.application.limits.get", description: "Read application/account message quota and reset data.", risk: "READ" },
  { name: "pushover.sound.list", description: "List built-in and application-owner custom notification sounds.", risk: "READ" },
  { name: "pushover.receipt.get", description: "Read acknowledgement and retry status for an emergency message receipt.", risk: "READ" },
  { name: "pushover.group.list", description: "List delivery groups owned by the application account.", risk: "READ" },
  { name: "pushover.group.get", description: "Read a delivery group and its members.", risk: "READ" },
  { name: "pushover.message.send", description: "Send an external push notification. Emergency priority requires retry and expiry parameters.", risk: "HIGH_RISK" },
  { name: "pushover.glance.update", description: "Update a user's Pushover Glance widget data.", risk: "WRITE" },
  { name: "pushover.receipt.cancel", description: "Cancel retries for one emergency-priority notification.", risk: "HIGH_RISK" },
  { name: "pushover.receipt.cancel_by_tag", description: "Cancel active emergency retries created by this application with a matching tag.", risk: "HIGH_RISK" },
  { name: "pushover.group.create", description: "Create a delivery group owned by the application account.", risk: "WRITE" },
  { name: "pushover.group.user.add", description: "Add a user/device membership to a delivery group.", risk: "WRITE" },
  { name: "pushover.group.user.remove", description: "Remove matching membership(s) from a delivery group.", risk: "DESTRUCTIVE" },
  { name: "pushover.group.user.disable", description: "Temporarily disable matching group membership(s).", risk: "HIGH_RISK" },
  { name: "pushover.group.user.enable", description: "Re-enable matching group membership(s).", risk: "WRITE" },
  { name: "pushover.group.rename", description: "Rename a delivery group.", risk: "WRITE" }
];

const key = z.string().regex(/^[A-Za-z0-9]{30}$/);
const device = z.string().regex(/^[A-Za-z0-9_-]{1,25}$/).optional();
const approval = z.enum(["approved", "approved-high-risk", "approved-destructive"]).optional();
const schemas = {
  "pushover.user.validate": z.object({ user: key, device }).strict(),
  "pushover.application.limits.get": z.object({}).strict(),
  "pushover.sound.list": z.object({}).strict(),
  "pushover.receipt.get": z.object({ receipt: key }).strict(),
  "pushover.group.list": z.object({}).strict(),
  "pushover.group.get": z.object({ group: key }).strict(),
  "pushover.message.send": z.object({
    user: z.string().min(30).max(1549).regex(/^[A-Za-z0-9,]+$/),
    message: z.string().min(1).max(1024), title: z.string().max(250).optional(), device,
    priority: z.number().int().min(-2).max(2).default(0), sound: z.string().min(1).max(64).optional(),
    url: z.string().url().max(512).optional(), url_title: z.string().max(100).optional(),
    timestamp: z.number().int().positive().optional(), ttl: z.number().int().positive().optional(),
    html: z.boolean().optional(), monospace: z.boolean().optional(),
    retry: z.number().int().min(30).optional(), expire: z.number().int().min(1).max(10800).optional(),
    tags: z.string().max(500).optional(), approval
  }).strict(),
  "pushover.glance.update": z.object({ user: key, device, title: z.string().max(100).optional(), text: z.string().max(100).optional(), subtext: z.string().max(100).optional(), count: z.number().int().optional(), percent: z.number().int().min(0).max(100).optional(), approval }).strict(),
  "pushover.receipt.cancel": z.object({ receipt: key, approval }).strict(),
  "pushover.receipt.cancel_by_tag": z.object({ tag: z.string().min(1).max(100), approval }).strict(),
  "pushover.group.create": z.object({ name: z.string().min(1).max(200), approval }).strict(),
  "pushover.group.user.add": z.object({ group: key, user: key, device, memo: z.string().max(200).optional(), approval }).strict(),
  "pushover.group.user.remove": z.object({ group: key, user: key, device, approval }).strict(),
  "pushover.group.user.disable": z.object({ group: key, user: key, device, approval }).strict(),
  "pushover.group.user.enable": z.object({ group: key, user: key, device, approval }).strict(),
  "pushover.group.rename": z.object({ group: key, name: z.string().min(1).max(200), approval }).strict()
} as const;

function validateMessage(v: any): void {
  if (v.html && v.monospace) throw new Error("VALIDATION: html and monospace are mutually exclusive");
  if (v.priority === 2 && (v.retry === undefined || v.expire === undefined)) throw new Error("VALIDATION: priority=2 requires retry and expire");
  if (v.priority !== 2 && (v.retry !== undefined || v.expire !== undefined || v.tags !== undefined)) throw new Error("VALIDATION: retry, expire, and tags are only valid for priority=2");
  if (String(v.user).split(",").length > 50) throw new Error("VALIDATION: a single request supports at most 50 user keys");
}
function output(tool: string, risk: Risk, result: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ provider: "pushover", tool, risk, untrusted_provider_content: true, result }, null, 2) }] };
}
export async function executeTool(name: string, input: Record<string, unknown>, client: PushoverClient, config: Config): Promise<unknown> {
  const spec = TOOL_SPECS.find((x) => x.name === name);
  if (!spec) throw new Error(`Unknown tool: ${name}`);
  const parsed: any = schemas[name as keyof typeof schemas].parse(input);
  if (name === "pushover.message.send") validateMessage(parsed);
  requireApproval(spec.risk, parsed.approval, config);
  delete parsed.approval;
  switch (name) {
    case "pushover.user.validate": return client.validate(parsed.user, parsed.device);
    case "pushover.application.limits.get": return client.limits();
    case "pushover.sound.list": return client.sounds();
    case "pushover.receipt.get": return client.receiptGet(parsed.receipt);
    case "pushover.group.list": return client.groups();
    case "pushover.group.get": return client.groupGet(parsed.group);
    case "pushover.message.send": return client.send({ ...parsed, html: parsed.html ? 1 : undefined, monospace: parsed.monospace ? 1 : undefined });
    case "pushover.glance.update": return client.glance(parsed);
    case "pushover.receipt.cancel": return client.receiptCancel(parsed.receipt);
    case "pushover.receipt.cancel_by_tag": return client.receiptCancelByTag(parsed.tag);
    case "pushover.group.create": return client.groupCreate(parsed.name);
    case "pushover.group.user.add": return client.groupAction(parsed.group, "add_user", parsed.user, parsed.device, parsed.memo);
    case "pushover.group.user.remove": return client.groupAction(parsed.group, "remove_user", parsed.user, parsed.device);
    case "pushover.group.user.disable": return client.groupAction(parsed.group, "disable_user", parsed.user, parsed.device);
    case "pushover.group.user.enable": return client.groupAction(parsed.group, "enable_user", parsed.user, parsed.device);
    case "pushover.group.rename": return client.groupRename(parsed.group, parsed.name);
    default: throw new Error(`Unhandled tool: ${name}`);
  }
}
export function registerTools(server: McpServer, client: PushoverClient, config: Config): void {
  for (const spec of TOOL_SPECS) {
    const schema = schemas[spec.name as keyof typeof schemas];
    server.tool(spec.name, spec.description, schema.shape, async (input) => output(spec.name, spec.risk, await executeTool(spec.name, input as Record<string, unknown>, client, config)));
  }
}
