import { createHmac, timingSafeEqual } from "node:crypto";
import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { z } from "zod";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export interface Config {
  apiKey: string;
  region: "us" | "eu";
  defaultGrantId?: string;
  timeoutMs: number;
  maxRetries: number;
  approveWrites: boolean;
  approveHighRisk: boolean;
  enableDestructive: boolean;
  webhookSecret?: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.NYLAS_API_KEY?.trim();
  if (!apiKey) throw new Error("NYLAS_API_KEY is required");
  const region = env.NYLAS_REGION === "eu" ? "eu" : "us";
  return {
    apiKey,
    region,
    defaultGrantId: env.NYLAS_GRANT_ID?.trim() || undefined,
    timeoutMs: positiveInt(env.NYLAS_TIMEOUT_MS, 30_000, 1_000, 90_000),
    maxRetries: positiveInt(env.NYLAS_MAX_RETRIES, 3, 0, 5),
    approveWrites: env.NYLAS_APPROVE_WRITES === "true",
    approveHighRisk: env.NYLAS_APPROVE_HIGH_RISK === "true",
    enableDestructive: env.NYLAS_ENABLE_DESTRUCTIVE === "true",
    webhookSecret: env.NYLAS_WEBHOOK_SECRET?.trim() || undefined
  };
}

function positiveInt(raw: string | undefined, fallback: number, min: number, max: number): number {
  const n = raw ? Number(raw) : fallback;
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`Invalid numeric configuration: ${raw}`);
  return n;
}

export function authorize(risk: Risk, approved: boolean | undefined, cfg: Config): void {
  if (risk === "READ") return;
  if (risk === "WRITE" && (approved === true || cfg.approveWrites)) return;
  if (risk === "HIGH_RISK" && approved === true && cfg.approveHighRisk) return;
  if (risk === "DESTRUCTIVE" && approved === true && cfg.enableDestructive) return;
  throw new Error(`Approval required for ${risk} operation`);
}

export class NylasError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly type?: string,
    public readonly retryAfterMs?: number
  ) { super(message); }
}

export class NylasRestClient {
  private readonly baseUrl: string;
  constructor(private readonly cfg: Config, private readonly fetchFn: typeof fetch = fetch) {
    this.baseUrl = `https://api.${cfg.region}.nylas.com/v3`;
  }

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
    const url = new URL(this.baseUrl + path);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
    const retryable = method === "GET";
    let attempt = 0;
    for (;;) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await this.fetchFn(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.cfg.apiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        let data: any = undefined;
        if (text) {
          try { data = JSON.parse(text); } catch { data = { raw: text }; }
        }
        if (response.ok) return data as T;
        const retryAfterMs = parseRetryAfter(response.headers.get("retry-after"));
        const type = data?.error?.type;
        const message = data?.error?.message ?? data?.message ?? `Nylas HTTP ${response.status}`;
        const shouldRetry = retryable && attempt < this.cfg.maxRetries && (response.status === 429 || response.status >= 500);
        if (!shouldRetry) throw new NylasError(message, response.status, type, retryAfterMs);
        await sleep(retryAfterMs ?? Math.min(500 * 2 ** attempt, 5_000));
        attempt++;
      } catch (error) {
        if (error instanceof NylasError) throw error;
        if ((error as Error).name === "AbortError") throw new NylasError("Nylas request timed out");
        if (!retryable || attempt >= this.cfg.maxRetries) throw new NylasError(`Network error: ${(error as Error).message}`);
        await sleep(Math.min(500 * 2 ** attempt, 5_000));
        attempt++;
      } finally {
        clearTimeout(timeout);
      }
    }
  }
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class NylasUpstreamMcp {
  private client?: Client;
  private transport?: StreamableHTTPClientTransport;
  constructor(private readonly cfg: Config) {}

  async call(tool: string, args: Record<string, unknown>): Promise<unknown> {
    if (!this.client) {
      this.client = new Client({ name: "nylas-policy-connector", version: "1.0.0" });
      this.transport = new StreamableHTTPClientTransport(new URL(`https://mcp.${this.cfg.region}.nylas.com`), {
        requestInit: { headers: { Authorization: `Bearer ${this.cfg.apiKey}` } }
      });
      await this.client.connect(this.transport);
    }
    const allowed = new Set([
      "get_grant", "list_messages", "get_message", "list_threads", "create_draft", "update_draft",
      "send_draft", "send_message", "list_calendars", "list_events", "get_event", "create_event",
      "update_event", "delete_event", "list_contacts"
    ]);
    if (!allowed.has(tool)) throw new Error(`Upstream MCP tool not allowlisted: ${tool}`);
    const result = await this.client.callTool({ name: tool, arguments: args });
    if ((result as any)?.isError) throw new Error(`Upstream MCP failed for ${tool}`);
    return result;
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
    this.transport = undefined;
  }
}

export interface ToolContext {
  rest: NylasRestClient;
  upstream: NylasUpstreamMcp;
  cfg: Config;
}

function grant(args: Record<string, any>, cfg: Config): string {
  const value = args.grant_id ?? cfg.defaultGrantId;
  if (!value || typeof value !== "string") throw new Error("grant_id is required when NYLAS_GRANT_ID is not configured");
  return value;
}

async function upstreamThenRest(ctx: ToolContext, upstreamTool: string, upstreamArgs: Record<string, unknown>, rest: () => Promise<unknown>): Promise<unknown> {
  try { return await ctx.upstream.call(upstreamTool, upstreamArgs); }
  catch { return await rest(); }
}

export const toolDefinitions = [
  { name: "nylas.grant.get", risk: "READ" as Risk },
  { name: "nylas.message.list", risk: "READ" as Risk },
  { name: "nylas.message.get", risk: "READ" as Risk },
  { name: "nylas.thread.list", risk: "READ" as Risk },
  { name: "nylas.draft.create", risk: "WRITE" as Risk },
  { name: "nylas.draft.update", risk: "WRITE" as Risk },
  { name: "nylas.draft.send", risk: "HIGH_RISK" as Risk },
  { name: "nylas.message.send", risk: "HIGH_RISK" as Risk },
  { name: "nylas.calendar.list", risk: "READ" as Risk },
  { name: "nylas.event.list", risk: "READ" as Risk },
  { name: "nylas.event.get", risk: "READ" as Risk },
  { name: "nylas.event.create", risk: "WRITE" as Risk },
  { name: "nylas.event.update", risk: "WRITE" as Risk },
  { name: "nylas.event.delete", risk: "DESTRUCTIVE" as Risk },
  { name: "nylas.contact.list", risk: "READ" as Risk },
  { name: "nylas.webhook.verify", risk: "READ" as Risk }
];

export async function executeTool(name: string, input: Record<string, any>, ctx: ToolContext): Promise<unknown> {
  const def = toolDefinitions.find(t => t.name === name);
  if (!def) throw new Error(`Unknown tool: ${name}`);
  authorize(def.risk, input.approved, ctx.cfg);
  const g = name === "nylas.webhook.verify" ? undefined : grant(input, ctx.cfg);
  switch (name) {
    case "nylas.grant.get":
      return upstreamThenRest(ctx, "get_grant", { grant_id: g }, () => ctx.rest.request("GET", `/grants/${enc(g!)}`));
    case "nylas.message.list":
      return upstreamThenRest(ctx, "list_messages", compact({ grant_id: g, limit: input.limit, page_token: input.page_token, subject: input.subject, unread: input.unread }), () => ctx.rest.request("GET", `/grants/${enc(g!)}/messages`, undefined, compact({ limit: input.limit, page_token: input.page_token, subject: input.subject, unread: input.unread })));
    case "nylas.message.get":
      return upstreamThenRest(ctx, "get_message", { grant_id: g, message_id: input.message_id }, () => ctx.rest.request("GET", `/grants/${enc(g!)}/messages/${enc(input.message_id)}`));
    case "nylas.thread.list":
      return upstreamThenRest(ctx, "list_threads", compact({ grant_id: g, limit: input.limit, page_token: input.page_token, subject: input.subject, unread: input.unread }), () => ctx.rest.request("GET", `/grants/${enc(g!)}/threads`, undefined, compact({ limit: input.limit, page_token: input.page_token, subject: input.subject, unread: input.unread })));
    case "nylas.draft.create": {
      const body = mailBody(input);
      return upstreamThenRest(ctx, "create_draft", { grant_id: g, ...body }, () => ctx.rest.request("POST", `/grants/${enc(g!)}/drafts`, body));
    }
    case "nylas.draft.update": {
      const body = mailBody(input);
      return upstreamThenRest(ctx, "update_draft", { grant_id: g, draft_id: input.draft_id, ...body }, () => ctx.rest.request("PUT", `/grants/${enc(g!)}/drafts/${enc(input.draft_id)}`, body));
    }
    case "nylas.draft.send":
      return upstreamThenRest(ctx, "send_draft", { grant_id: g, draft_id: input.draft_id }, () => ctx.rest.request("POST", `/grants/${enc(g!)}/drafts/${enc(input.draft_id)}`, {}));
    case "nylas.message.send": {
      const body = mailBody(input);
      return upstreamThenRest(ctx, "send_message", { grant_id: g, ...body }, () => ctx.rest.request("POST", `/grants/${enc(g!)}/messages/send`, body));
    }
    case "nylas.calendar.list":
      return upstreamThenRest(ctx, "list_calendars", { grant_id: g }, () => ctx.rest.request("GET", `/grants/${enc(g!)}/calendars`));
    case "nylas.event.list":
      return upstreamThenRest(ctx, "list_events", compact({ grant_id: g, calendar_id: input.calendar_id, limit: input.limit, page_token: input.page_token }), () => ctx.rest.request("GET", `/grants/${enc(g!)}/events`, undefined, compact({ calendar_id: input.calendar_id, limit: input.limit, page_token: input.page_token })));
    case "nylas.event.get":
      return upstreamThenRest(ctx, "get_event", { grant_id: g, event_id: input.event_id, calendar_id: input.calendar_id }, () => ctx.rest.request("GET", `/grants/${enc(g!)}/events/${enc(input.event_id)}`, undefined, { calendar_id: input.calendar_id }));
    case "nylas.event.create": {
      const body = eventBody(input);
      return upstreamThenRest(ctx, "create_event", { grant_id: g, ...body }, () => ctx.rest.request("POST", `/grants/${enc(g!)}/events`, body, { calendar_id: input.calendar_id }));
    }
    case "nylas.event.update": {
      const body = eventBody(input);
      return upstreamThenRest(ctx, "update_event", { grant_id: g, event_id: input.event_id, ...body }, () => ctx.rest.request("PUT", `/grants/${enc(g!)}/events/${enc(input.event_id)}`, body, { calendar_id: input.calendar_id }));
    }
    case "nylas.event.delete":
      return upstreamThenRest(ctx, "delete_event", { grant_id: g, event_id: input.event_id, calendar_id: input.calendar_id }, () => ctx.rest.request("DELETE", `/grants/${enc(g!)}/events/${enc(input.event_id)}`, undefined, { calendar_id: input.calendar_id }));
    case "nylas.contact.list":
      return upstreamThenRest(ctx, "list_contacts", compact({ grant_id: g, limit: input.limit, page_token: input.page_token, email: input.email }), () => ctx.rest.request("GET", `/grants/${enc(g!)}/contacts`, undefined, compact({ limit: input.limit, page_token: input.page_token, email: input.email })));
    case "nylas.webhook.verify":
      return { valid: verifyWebhook(input.raw_body, input.signature, ctx.cfg.webhookSecret) };
  }
}

function compact(value: Record<string, any>): Record<string, any> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined && v !== null && v !== ""));
}

function enc(value: string): string { return encodeURIComponent(value); }

function mailBody(input: Record<string, any>): Record<string, any> {
  const body = compact({ subject: input.subject, body: input.body, reply_to_message_id: input.reply_to_message_id });
  if (input.to) body.to = input.to.map((email: string) => ({ email }));
  if (input.cc) body.cc = input.cc.map((email: string) => ({ email }));
  if (input.bcc) body.bcc = input.bcc.map((email: string) => ({ email }));
  return body;
}

function eventBody(input: Record<string, any>): Record<string, any> {
  const body: Record<string, any> = compact({ title: input.title, description: input.description, location: input.location });
  if (input.start_time !== undefined && input.end_time !== undefined) body.when = { start_time: input.start_time, end_time: input.end_time };
  if (input.participants) body.participants = input.participants.map((email: string) => ({ email }));
  return body;
}

export function verifyWebhook(rawBody: string, signature: string, secret?: string): boolean {
  if (!secret) throw new Error("NYLAS_WEBHOOK_SECRET is not configured");
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
}

const email = z.string().email();
const common = { grant_id: z.string().min(1).optional(), approved: z.boolean().optional() };
const listCommon = { ...common, limit: z.number().int().min(1).max(100).optional(), page_token: z.string().min(1).optional() };

export function createServer(ctx: ToolContext): McpServer {
  const server = new McpServer({ name: "nylas-policy-connector", version: "1.0.0" });
  const reg = (name: string, description: string, schema: any) => server.registerTool(name, { description, inputSchema: schema }, async (args: any) => {
    try {
      const result = await executeTool(name, args, ctx);
      return { content: [{ type: "text", text: JSON.stringify({ data: result, untrusted_provider_content: name !== "nylas.webhook.verify" }) }] };
    } catch (error) {
      return { isError: true, content: [{ type: "text", text: JSON.stringify({ error: (error as Error).message }) }] };
    }
  });

  reg("nylas.grant.get", "Get metadata for a connected Nylas grant.", common);
  reg("nylas.message.list", "List/search messages with bounded pagination.", { ...listCommon, subject: z.string().max(200).optional(), unread: z.boolean().optional() });
  reg("nylas.message.get", "Read one message by ID.", { ...common, message_id: z.string().min(1) });
  reg("nylas.thread.list", "List/search email threads.", { ...listCommon, subject: z.string().max(200).optional(), unread: z.boolean().optional() });
  reg("nylas.draft.create", "Create an email draft without sending it.", { ...common, to: z.array(email).min(1).max(50), cc: z.array(email).max(50).optional(), bcc: z.array(email).max(50).optional(), subject: z.string().max(998), body: z.string().max(1_000_000), reply_to_message_id: z.string().optional() });
  reg("nylas.draft.update", "Update an existing email draft.", { ...common, draft_id: z.string().min(1), to: z.array(email).min(1).max(50), cc: z.array(email).max(50).optional(), bcc: z.array(email).max(50).optional(), subject: z.string().max(998), body: z.string().max(1_000_000) });
  reg("nylas.draft.send", "Send a previously created draft; explicit approval is required.", { ...common, draft_id: z.string().min(1) });
  reg("nylas.message.send", "Send an external email; explicit approval is required.", { ...common, to: z.array(email).min(1).max(50), cc: z.array(email).max(50).optional(), bcc: z.array(email).max(50).optional(), subject: z.string().max(998), body: z.string().max(1_000_000), reply_to_message_id: z.string().optional() });
  reg("nylas.calendar.list", "List calendars for a grant.", common);
  reg("nylas.event.list", "List calendar events.", { ...listCommon, calendar_id: z.string().min(1) });
  reg("nylas.event.get", "Get one calendar event.", { ...common, calendar_id: z.string().min(1), event_id: z.string().min(1) });
  reg("nylas.event.create", "Create a calendar event; configurable write approval applies.", { ...common, calendar_id: z.string().min(1), title: z.string().min(1).max(500), description: z.string().max(10000).optional(), location: z.string().max(1000).optional(), start_time: z.number().int(), end_time: z.number().int(), participants: z.array(email).max(100).optional() });
  reg("nylas.event.update", "Update a calendar event; configurable write approval applies.", { ...common, calendar_id: z.string().min(1), event_id: z.string().min(1), title: z.string().min(1).max(500).optional(), description: z.string().max(10000).optional(), location: z.string().max(1000).optional(), start_time: z.number().int().optional(), end_time: z.number().int().optional(), participants: z.array(email).max(100).optional() });
  reg("nylas.event.delete", "Delete a calendar event; disabled by default and requires explicit approval.", { ...common, calendar_id: z.string().min(1), event_id: z.string().min(1) });
  reg("nylas.contact.list", "List contacts with optional email filter.", { ...listCommon, email: z.string().email().optional() });
  reg("nylas.webhook.verify", "Verify an X-Nylas-Signature against the exact raw request body.", { raw_body: z.string(), signature: z.string().min(1) });
  return server;
}

export async function main(): Promise<void> {
  const cfg = loadConfig();
  const ctx: ToolContext = { cfg, rest: new NylasRestClient(cfg), upstream: new NylasUpstreamMcp(cfg) };
  const server = createServer(ctx);
  const transport = new StdioServerTransport();
  process.once("SIGINT", async () => { await ctx.upstream.close(); process.exit(0); });
  process.once("SIGTERM", async () => { await ctx.upstream.close(); process.exit(0); });
  await server.connect(transport);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error((error as Error).message); process.exit(1); });
}
