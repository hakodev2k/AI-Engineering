import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { PayPalConfig } from "./config.js";
import { PayPalTokenProvider } from "./auth.js";
import type { Risk } from "./policy.js";

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  "list_invoices",
  "get_invoice",
  "create_invoice",
  "send_invoice",
  "send_invoice_reminder",
  "cancel_sent_invoice",
  "create_order",
  "get_order",
  "pay_order",
  "create_refund",
  "get_refund",
  "list_disputes",
  "get_dispute",
  "accept_dispute_claim"
]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class PayPalUpstream {
  private client?: Client;
  private activeToken?: string;

  constructor(
    private readonly config: PayPalConfig,
    private readonly tokens: PayPalTokenProvider
  ) {}

  private async connect(forceRefresh = false): Promise<Client> {
    const token = await this.tokens.getToken(forceRefresh);
    if (this.client && this.activeToken === token) return this.client;

    if (this.client) {
      await this.client.close().catch(() => undefined);
      this.client = undefined;
    }

    const client = new Client({ name: "ai-engineering-paypal-wrapper", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpEndpoint), {
      requestInit: { headers: { Authorization: `Bearer ${token}` } }
    });
    await client.connect(transport);
    this.client = client;
    this.activeToken = token;
    return client;
  }

  private async invoke(name: string, args: Record<string, unknown>, forceRefresh = false): Promise<unknown> {
    const client = await this.connect(forceRefresh);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      return await client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  async call(name: string, args: Record<string, unknown>, risk: Risk): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) {
      throw new Error(`Upstream PayPal MCP tool ${name} is not allowlisted.`);
    }

    try {
      return await this.invoke(name, args);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/\b401\b|unauthori[sz]ed|token.*expir/i.test(message)) {
        this.client = undefined;
        this.activeToken = undefined;
        return await this.invoke(name, args, true);
      }
      if (risk === "READ" && /\b429\b|\b500\b|\b502\b|\b503\b|\b504\b|ECONNRESET|ETIMEDOUT|fetch failed/i.test(message)) {
        await sleep(300 + Math.floor(Math.random() * 200));
        return await this.invoke(name, args);
      }
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close().catch(() => undefined);
    this.client = undefined;
    this.activeToken = undefined;
  }
}
