import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { RenderConfig } from './config.js';

export class RenderError extends Error {
  constructor(message: string, public status?: number, public retryAfter?: number) { super(message); }
}

function safeJson(text: string): unknown {
  try { return text ? JSON.parse(text) : {}; } catch { return { text }; }
}

export class RenderConnectorClient {
  private mcp?: Client;
  constructor(private readonly config: RenderConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async close() { if (this.mcp) await this.mcp.close(); }

  private async mcpClient(): Promise<Client> {
    if (this.mcp) return this.mcp;
    const client = new Client({ name: 'ai-engineering-render-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.apiKey}` } }
    });
    await client.connect(transport);
    this.mcp = client;
    return client;
  }

  async callMcp(tool: string, args: Record<string, unknown> = {}): Promise<unknown> {
    const client = await this.mcpClient();
    const result = await client.callTool({ name: tool, arguments: args });
    if ((result as any).isError) throw new RenderError(`Render MCP tool ${tool} failed`);
    if ((result as any).structuredContent != null) return (result as any).structuredContent;
    const text = Array.isArray((result as any).content)
      ? (result as any).content.filter((x: any) => x?.type === 'text').map((x: any) => x.text).join('\n')
      : '';
    return safeJson(text);
  }

  async rest(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<unknown> {
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await res.text();
        if (res.ok) return safeJson(text);
        const retryAfterHeader = res.headers.get('retry-after');
        const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
        const retryable = res.status === 429 || res.status >= 500;
        if (!retryable || attempt >= this.config.maxRetries || !['GET', 'HEAD'].includes(method)) {
          throw new RenderError(`Render API ${method} ${path} failed (${res.status}): ${text.slice(0, 500)}`, res.status, retryAfter);
        }
        const reset = Number(res.headers.get('ratelimit-reset'));
        const backoff = Number.isFinite(retryAfter) ? retryAfter! * 1000 : Number.isFinite(reset) ? Math.max(0, reset * 1000 - Date.now()) : Math.min(500 * 2 ** attempt, 4000);
        await new Promise(r => setTimeout(r, backoff + Math.floor(Math.random() * 200)));
        attempt++;
      } catch (error) {
        if ((error as Error).name === 'AbortError') throw new RenderError(`Render API ${method} ${path} timed out`);
        throw error;
      } finally { clearTimeout(timer); }
    }
  }

  async mcpWithRestFallback(mcpTool: string, mcpArgs: Record<string, unknown>, rest: () => Promise<unknown>): Promise<unknown> {
    try { return await this.callMcp(mcpTool, mcpArgs); }
    catch (error) {
      if (!this.config.enableApiFallback) throw error;
      return rest();
    }
  }
}
