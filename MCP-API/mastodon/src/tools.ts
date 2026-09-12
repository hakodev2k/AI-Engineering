import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import type { Config } from "./config.js";
import type { MastodonClient } from "./client.js";
import { requireApproval, type Risk } from "./policy.js";

const id = z.string().regex(/^\d+$/).max(40);
const limit = z.number().int().min(1).max(40).optional();
const approval = z.enum(["approved", "approved-high-risk", "approved-destructive"]).optional();
const visibility = z.enum(["public", "unlisted", "private", "direct"]);

export const TOOL_SPECS = [
  ["mastodon.profile.me", "READ"], ["mastodon.timeline.public", "READ"], ["mastodon.timeline.home", "READ"],
  ["mastodon.search", "READ"], ["mastodon.notifications.list", "READ"], ["mastodon.favourites.list", "READ"],
  ["mastodon.bookmarks.list", "READ"], ["mastodon.status.get", "READ"], ["mastodon.status.create", "HIGH_RISK"],
  ["mastodon.status.delete", "DESTRUCTIVE"], ["mastodon.status.favourite", "WRITE"], ["mastodon.status.unfavourite", "WRITE"],
  ["mastodon.status.reblog", "HIGH_RISK"], ["mastodon.status.unreblog", "WRITE"], ["mastodon.status.bookmark", "WRITE"],
  ["mastodon.status.unbookmark", "WRITE"]
] as const satisfies readonly (readonly [string, Risk])[];

function result(tool: string, risk: Risk, value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ provider: "mastodon", tool, risk, untrusted_provider_content: true, result: value }, null, 2) }] };
}

export function registerTools(server: McpServer, client: MastodonClient, config: Config): void {
  server.tool("mastodon.profile.me", "Read the authenticated account profile.", {}, async () => result("mastodon.profile.me", "READ", await client.request("GET", "/api/v1/accounts/verify_credentials")));
  server.tool("mastodon.timeline.public", "Read the instance public timeline.", { limit, local: z.boolean().optional(), only_media: z.boolean().optional(), max_id: id.optional(), min_id: id.optional() }, async p => result("mastodon.timeline.public", "READ", await client.request("GET", "/api/v1/timelines/public", { query: p })));
  server.tool("mastodon.timeline.home", "Read the authenticated home timeline.", { limit, max_id: id.optional(), min_id: id.optional(), since_id: id.optional() }, async p => result("mastodon.timeline.home", "READ", await client.request("GET", "/api/v1/timelines/home", { query: p })));
  server.tool("mastodon.search", "Search accounts, statuses, or hashtags on this instance.", { q: z.string().min(1).max(500), type: z.enum(["accounts", "hashtags", "statuses"]).optional(), limit: z.number().int().min(1).max(40).optional(), resolve: z.boolean().optional() }, async p => result("mastodon.search", "READ", await client.request("GET", "/api/v2/search", { query: p })));
  server.tool("mastodon.notifications.list", "List notifications for the authenticated account.", { limit, max_id: id.optional(), min_id: id.optional(), account_id: id.optional() }, async p => result("mastodon.notifications.list", "READ", await client.request("GET", "/api/v1/notifications", { query: p })));
  server.tool("mastodon.favourites.list", "List statuses favourited by the authenticated account.", { limit, max_id: id.optional(), min_id: id.optional() }, async p => result("mastodon.favourites.list", "READ", await client.request("GET", "/api/v1/favourites", { query: p })));
  server.tool("mastodon.bookmarks.list", "List privately bookmarked statuses.", { limit, max_id: id.optional(), min_id: id.optional() }, async p => result("mastodon.bookmarks.list", "READ", await client.request("GET", "/api/v1/bookmarks", { query: p })));
  server.tool("mastodon.status.get", "Read one status by local ID.", { id }, async p => result("mastodon.status.get", "READ", await client.request("GET", `/api/v1/statuses/${p.id}`)));
  server.tool("mastodon.status.create", "Publish a status. Explicit high-risk approval is required because this sends public/external content.", { status: z.string().min(1).max(10000), visibility: visibility.optional(), spoiler_text: z.string().max(5000).optional(), sensitive: z.boolean().optional(), in_reply_to_id: id.optional(), language: z.string().regex(/^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})?$/).optional(), approval }, async p => { requireApproval("HIGH_RISK", p.approval, config); const { approval: _a, ...form } = p; return result("mastodon.status.create", "HIGH_RISK", await client.request("POST", "/api/v1/statuses", { form, idempotencyKey: randomUUID() })); });
  server.tool("mastodon.status.delete", "Delete one of your statuses. Disabled by default and requires destructive approval.", { id, delete_media: z.boolean().optional(), approval }, async p => { requireApproval("DESTRUCTIVE", p.approval, config); return result("mastodon.status.delete", "DESTRUCTIVE", await client.request("DELETE", `/api/v1/statuses/${p.id}`, { query: { delete_media: p.delete_media } })); });
  const interact = (name: string, action: string, risk: Risk) => server.tool(name, `${action} a status.`, { id, approval }, async p => { requireApproval(risk, p.approval, config); return result(name, risk, await client.request("POST", `/api/v1/statuses/${p.id}/${action}`)); });
  interact("mastodon.status.favourite", "favourite", "WRITE"); interact("mastodon.status.unfavourite", "unfavourite", "WRITE");
  interact("mastodon.status.reblog", "reblog", "HIGH_RISK"); interact("mastodon.status.unreblog", "unreblog", "WRITE");
  interact("mastodon.status.bookmark", "bookmark", "WRITE"); interact("mastodon.status.unbookmark", "unbookmark", "WRITE");
}
