import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

const MCP_URL = 'https://mcp.razorpay.com/mcp';
const API_BASE = 'https://api.razorpay.com/v1';

export class RazorpayError extends Error {
  constructor(message: string, public status?: number, public retryAfter?: number) { super(message); }
}

export class RazorpayClient {
  private mcp?: Client;
  constructor(private readonly cfg: Config) {}

  private async mcpClient(): Promise<Client> {
    if (this.mcp) return this.mcp;
    const client = new Client({ name: 'ai-engineering-razorpay-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
      requestInit: { headers: { Authorization: `Basic ${this.cfg.merchantToken}` } }
    });
    await client.connect(transport);
    const listed = await client.listTools();
    const allowed = new Set([
      'fetch_payment','fetch_payment_card_details','fetch_all_payments','capture_payment',
      'fetch_order','fetch_all_orders','fetch_order_payments','create_order',
      'fetch_payment_link','fetch_all_payment_links','create_payment_link',
      'fetch_refund','fetch_all_refunds','fetch_all_settlements','fetch_settlement_with_id','fetch_settlement_recon_details'
    ]);
    for (const t of listed.tools) if (!allowed.has(t.name)) continue;
    this.mcp = client;
    return client;
  }

  async mcpCall(tool: string, args: Record<string, unknown>, retryRead = false): Promise<unknown> {
    const attempts = retryRead ? 2 : 1;
    let last: unknown;
    for (let i = 0; i < attempts; i++) {
      try {
        const client = await this.mcpClient();
        const result = await client.callTool({ name: tool, arguments: args });
        if (result.isError) throw new Error(`Upstream MCP tool ${tool} returned an error`);
        if (result.structuredContent !== undefined) return result.structuredContent;
        return result.content;
      } catch (e) {
        last = e;
        this.mcp = undefined;
        if (i + 1 < attempts) await new Promise(r => setTimeout(r, 250 * (i + 1)));
      }
    }
    throw last instanceof Error ? last : new Error(String(last));
  }

  async rest(method: 'GET'|'POST'|'PATCH', path: string, opts: { query?: Record<string, string|number|boolean|undefined>; body?: unknown; retry?: boolean } = {}): Promise<unknown> {
    const url = new URL(API_BASE + path);
    for (const [k,v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const attempts = opts.retry && method === 'GET' ? 3 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const res = await fetch(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.cfg.keyId}:${this.cfg.keySecret}`).toString('base64')}`,
            Accept: 'application/json',
            ...(opts.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: opts.body === undefined ? undefined : JSON.stringify(opts.body)
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (res.ok) return data;
        const retryAfter = Number(res.headers.get('retry-after') ?? '0') || undefined;
        const msg = typeof data?.error?.description === 'string' ? data.error.description : `Razorpay API HTTP ${res.status}`;
        if ((res.status === 429 || res.status >= 500) && attempt + 1 < attempts) {
          await new Promise(r => setTimeout(r, retryAfter ? Math.min(retryAfter * 1000, 5000) : 250 * 2 ** attempt));
          continue;
        }
        throw new RazorpayError(msg, res.status, retryAfter);
      } catch (e) {
        if (e instanceof RazorpayError) throw e;
        if (attempt + 1 >= attempts) throw new RazorpayError(e instanceof Error ? e.message : String(e));
      } finally { clearTimeout(timer); }
    }
    throw new RazorpayError('Razorpay request failed');
  }

  async readWithFallback(tool: string, args: Record<string, unknown>, path: string, query?: Record<string, string|number|boolean|undefined>): Promise<unknown> {
    try { return await this.mcpCall(tool, args, true); }
    catch { return this.rest('GET', path, { query, retry: true }); }
  }
}
