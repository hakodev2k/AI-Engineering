import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { FreshserviceConfig } from "./config.js";
import type { Upstream } from "./upstream.js";
import { assertAllowed } from "./policy.js";

const id = z.number().int().positive();
const cursor = z.string().min(1).max(500).optional();
const text = z.string().min(1).max(10000);

function result(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value) }] };
}

export function registerTools(server: McpServer, upstream: Upstream, config: FreshserviceConfig): void {
  server.tool("freshservice.ticket.list", "List Freshservice tickets. READ.", { nextCursor: cursor }, async (a) => result(await upstream.call("fetchTickets", a)));
  server.tool("freshservice.ticket.get", "Get a Freshservice ticket by ID. READ.", { ticketId: id }, async (a) => result(await upstream.call("fetchTicket", a)));
  server.tool("freshservice.ticket.search", "Filter Freshservice tickets by supported ticket fields. READ.", { query: z.string().min(1).max(1000), nextCursor: cursor }, async (a) => result(await upstream.call("fetchTicketFilter", a)));
  server.tool("freshservice.ticket.create", "Create a Freshservice ticket. WRITE; explicit approval required.", { subject: z.string().min(1).max(255), description: text, email: z.string().email(), priority: z.number().int().min(1).max(4).optional(), status: z.number().int().min(2).max(5).optional(), approved: z.literal(true) }, async (a) => { assertAllowed(config, "WRITE", a.approved); const { approved, ...args } = a; return result(await upstream.call("createTicket", args)); });
  server.tool("freshservice.ticket.update", "Update selected ticket fields. WRITE; explicit approval required.", { ticketId: id, status: z.number().int().min(2).max(5).optional(), priority: z.number().int().min(1).max(4).optional(), subject: z.string().min(1).max(255).optional(), approved: z.literal(true) }, async (a) => { assertAllowed(config, "WRITE", a.approved); const { approved, ...args } = a; return result(await upstream.call("updateTicket", args)); });
  server.tool("freshservice.ticket.note.create", "Add a note to a ticket. WRITE; explicit approval required.", { ticketId: id, body: text, private: z.boolean().default(true), approved: z.literal(true) }, async (a) => { assertAllowed(config, "WRITE", a.approved); const { approved, ...args } = a; return result(await upstream.call("createTicketNote", args)); });
  server.tool("freshservice.asset.list", "List assets. READ.", { nextCursor: cursor }, async (a) => result(await upstream.call("fetchAssets", a)));
  server.tool("freshservice.asset.get", "Get an asset by ID. READ.", { assetId: id }, async (a) => result(await upstream.call("fetchAsset", a)));
  server.tool("freshservice.agent.list", "List agents. READ.", { nextCursor: cursor }, async (a) => result(await upstream.call("fetchAgents", a)));
  server.tool("freshservice.requester.list", "List requesters. READ.", { nextCursor: cursor }, async (a) => result(await upstream.call("fetchRequesters", a)));
  server.tool("freshservice.service_catalog.search", "Search service catalog items. READ.", { query: z.string().min(1).max(200), nextCursor: cursor }, async (a) => result(await upstream.call("fetchServiceCatalogItemSearch", a)));
  server.tool("freshservice.solution_article.search", "Search solution articles. READ.", { query: z.string().min(1).max(200), nextCursor: cursor }, async (a) => result(await upstream.call("fetchSolutionArticleSearch", a)));
}
