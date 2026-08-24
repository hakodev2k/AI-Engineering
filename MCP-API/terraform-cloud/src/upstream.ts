import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

export class TerraformCloudError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

export class HybridUpstream {
  private mcp?: Client;
  private mcpReady?: Promise<void>;

  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  private async connectMcp() {
    if (this.mcpReady) return this.mcpReady;
    this.mcpReady = (async () => {
      const client = new Client({ name: 'terraform-cloud-connector-upstream', version: '1.0.0' });
      const transport = new StdioClientTransport({
        command: this.config.command,
        args: this.config.args,
        env: { ...process.env, TFE_ADDRESS: this.config.address, TFE_TOKEN: this.config.token, ENABLE_TF_OPERATIONS: this.config.enableDestructive ? 'true' : 'false' } as Record<string, string>
      });
      await client.connect(transport);
      this.mcp = client;
    })();
    try { await this.mcpReady; } catch { this.mcpReady = undefined; this.mcp = undefined; }
  }

  async callMcp(tool: string, args: Record<string, unknown>): Promise<unknown | undefined> {
    await this.connectMcp();
    if (!this.mcp) return undefined;
    try {
      const tools = await this.mcp.listTools();
      if (!tools.tools.some(t => t.name === tool)) return undefined;
      const result = await this.mcp.callTool({ name: tool, arguments: args });
      if (result.isError) return undefined;
      return result;
    } catch { return undefined; }
  }

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.config.address}/api/v2${path}`);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/vnd.api+json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/vnd.api+json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        const retryable = method === 'GET' && (res.status === 429 || res.status >= 500);
        if (retryable && attempt < this.config.maxRetries) {
          await new Promise(r => setTimeout(r, retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt)));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new TerraformCloudError(res.status, `HCP Terraform API ${res.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        if (res.status === 204) return undefined as T;
        return await res.json() as T;
      } catch (err) {
        if (err instanceof TerraformCloudError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`HCP Terraform API timeout after ${this.config.timeoutMs}ms`);
        if (method !== 'GET' || attempt >= this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally { clearTimeout(timer); }
    }
  }

  async preferred<T>(mcpTool: string, mcpArgs: Record<string, unknown>, fallback: () => Promise<T>): Promise<unknown> {
    const mcp = await this.callMcp(mcpTool, mcpArgs);
    return mcp ?? fallback();
  }

  async close() { if (this.mcp) await this.mcp.close(); }
}
