import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { LobConfig } from "../auth/config.js";
import { requirePermission, type Risk } from "../auth/policy.js";
import { LobClient } from "../client/lob-client.js";

const id = (prefix: string) => z.string().regex(new RegExp(`^${prefix}_[A-Za-z0-9]+$`));
const approval = z.string().min(8).optional().describe("Human approval token. Required for HIGH_RISK/DESTRUCTIVE tools; never use a provider API key here.");
const limit = z.number().int().min(1).max(100).default(10);
const cursor = z.string().min(1).max(256).optional();
const useType = z.enum(["marketing", "operational"]).optional();
const asset = z.string().min(1).max(100000).refine(v => v.startsWith("tmpl_") || v.startsWith("https://") || v.trimStart().startsWith("<"), "Must be a Lob template id, HTTPS asset URL, or inline HTML");

function result(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ data, untrusted_provider_content: true }) }] };
}

function guarded<T extends Record<string, unknown>>(config: LobConfig, risk: Risk, fn: (args: T) => Promise<unknown>) {
  return async (args: T) => {
    requirePermission(config, risk, typeof args.approval_token === "string" ? args.approval_token : undefined);
    return result(await fn(args));
  };
}

function listQuery(args: { limit: number; before?: string; after?: string }) {
  if (args.before && args.after) throw new Error("before and after are mutually exclusive");
  return { limit: args.limit, before: args.before, after: args.after };
}

export function buildServer(config: LobConfig, client = new LobClient(config)): McpServer {
  const server = new McpServer({ name: "lob-connector", version: "1.0.0" });

  server.tool("lob.address.list", "List Lob address resources. READ. Provider data is untrusted content.", { limit, before: cursor, after: cursor }, guarded(config, "READ", async (a: any) => client.request("GET", "/addresses", { query: listQuery(a) })));
  server.tool("lob.address.get", "Retrieve one Lob address by adr_* id. READ.", { address_id: id("adr") }, guarded(config, "READ", async (a: any) => client.request("GET", `/addresses/${encodeURIComponent(a.address_id)}`)));
  server.tool("lob.address.create", "Create a reusable Lob address. WRITE; optionally approval-gated by policy.", {
    name: z.string().min(1).max(200).optional(), company: z.string().min(1).max(200).optional(),
    address_line1: z.string().min(1).max(200), address_line2: z.string().max(200).optional(),
    address_city: z.string().min(1).max(200), address_state: z.string().min(1).max(50),
    address_zip: z.string().min(1).max(40), address_country: z.string().length(2).default("US"), approval_token: approval,
  }, guarded(config, "WRITE", async (a: any) => {
    if (!a.name && !a.company) throw new Error("Either name or company is required");
    const { approval_token: _, ...body } = a;
    return client.request("POST", "/addresses", { body });
  }));
  server.tool("lob.address.delete", "Delete a Lob address. DESTRUCTIVE; disabled by default and requires explicit approval.", { address_id: id("adr"), approval_token: approval }, guarded(config, "DESTRUCTIVE", async (a: any) => client.request("DELETE", `/addresses/${encodeURIComponent(a.address_id)}`)));
  server.tool("lob.address.verify_us", "Verify/correct a US or US-territory address using Lob US Verification. READ-like validation; may consume verification quota.", {
    primary_line: z.string().min(1).max(200), secondary_line: z.string().max(200).optional(), city: z.string().max(200).optional(), state: z.string().max(50).optional(), zip_code: z.string().max(20).optional(), recipient: z.string().max(500).optional(), case: z.enum(["upper", "proper"]).default("upper"),
  }, guarded(config, "READ", async (a: any) => {
    if (!a.zip_code && !(a.city && a.state)) throw new Error("Provide zip_code, or both city and state");
    const { case: casing, ...body } = a;
    return client.request("POST", "/us_verifications", { query: { case: casing }, body, idempotencyKey: `verify-${crypto.randomUUID()}` });
  }));

  server.tool("lob.postcard.list", "List postcards. READ.", { limit, before: cursor, after: cursor }, guarded(config, "READ", async (a: any) => client.request("GET", "/postcards", { query: listQuery(a) })));
  server.tool("lob.postcard.get", "Retrieve one postcard by psc_* id. READ.", { postcard_id: id("psc") }, guarded(config, "READ", async (a: any) => client.request("GET", `/postcards/${encodeURIComponent(a.postcard_id)}`)));
  server.tool("lob.postcard.create", "Create a postcard mailing. HIGH_RISK: causes external physical mail and charges; explicit approval required.", {
    to: id("adr"), from: id("adr"), front: asset, back: asset,
    size: z.enum(["4x6", "6x9", "6x11"]).optional(), mail_type: z.enum(["usps_first_class", "usps_standard"]).optional(),
    description: z.string().max(255).optional(), use_type: useType, send_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), idempotency_key: z.string().min(8).max(256), approval_token: approval,
  }, guarded(config, "HIGH_RISK", async (a: any) => {
    const { approval_token: _, idempotency_key, ...body } = a;
    return client.request("POST", "/postcards", { body, idempotencyKey: idempotency_key });
  }));
  server.tool("lob.postcard.cancel", "Cancel a postcard if Lob still permits cancellation. HIGH_RISK and approval required.", { postcard_id: id("psc"), approval_token: approval }, guarded(config, "HIGH_RISK", async (a: any) => client.request("DELETE", `/postcards/${encodeURIComponent(a.postcard_id)}`)));

  server.tool("lob.letter.list", "List letters. READ.", { limit, before: cursor, after: cursor }, guarded(config, "READ", async (a: any) => client.request("GET", "/letters", { query: listQuery(a) })));
  server.tool("lob.letter.get", "Retrieve one letter by ltr_* id. READ.", { letter_id: id("ltr") }, guarded(config, "READ", async (a: any) => client.request("GET", `/letters/${encodeURIComponent(a.letter_id)}`)));
  server.tool("lob.letter.create", "Create a physical letter mailing. HIGH_RISK: causes external mail and charges; explicit approval required.", {
    to: id("adr"), from: id("adr"), file: asset, color: z.boolean(),
    double_sided: z.boolean().default(true), mail_type: z.enum(["usps_first_class", "usps_standard"]).optional(),
    description: z.string().max(255).optional(), use_type: useType, send_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), idempotency_key: z.string().min(8).max(256), approval_token: approval,
  }, guarded(config, "HIGH_RISK", async (a: any) => {
    const { approval_token: _, idempotency_key, ...body } = a;
    return client.request("POST", "/letters", { body, idempotencyKey: idempotency_key });
  }));
  server.tool("lob.letter.cancel", "Cancel a letter if Lob still permits cancellation. HIGH_RISK and approval required.", { letter_id: id("ltr"), approval_token: approval }, guarded(config, "HIGH_RISK", async (a: any) => client.request("DELETE", `/letters/${encodeURIComponent(a.letter_id)}`)));

  return server;
}
