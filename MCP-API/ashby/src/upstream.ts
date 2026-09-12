import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export interface Upstream {
  call(operation: string, endpoint: string, body: Record<string, unknown>, mcpKeywords: string[]): Promise<unknown>;
  close(): Promise<void>;
}

function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }
function retryable(status: number): boolean { return status === 408 || status === 429 || status >= 500; }

export class AshbyUpstream implements Upstream {
  private client?: Client;
  private transport?: StreamableHTTPClientTransport;
  private toolNames?: string[];

  constructor(private readonly config: Config) {}

  private async connectMcp(): Promise<void> {
    if (!this.config.mcpAccessToken || this.client) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.mcpAccessToken}` } }
    });
    const client = new Client({ name: "ashby-connector", version: "1.0.0" });
    await client.connect(transport);
    this.transport = transport;
    this.client = client;
    const listed = await client.listTools();
    this.toolNames = listed.tools.map(t => t.name);
  }

  private chooseTool(keywords: string[]): string | undefined {
    const names = this.toolNames ?? [];
    const scored = names.map(name => ({
      name,
      score: keywords.reduce((n, k) => n + (name.toLowerCase().includes(k.toLowerCase()) ? 1 : 0), 0)
    })).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
    return scored[0]?.score === keywords.length ? scored[0].name : undefined;
  }

  private async tryMcp(keywords: string[], body: Record<string, unknown>): Promise<unknown | undefined> {
    if (!this.config.mcpAccessToken) return undefined;
    try {
      await this.connectMcp();
      const name = this.chooseTool(keywords);
      if (!name || !this.client) return undefined;
      return await this.client.callTool({ name, arguments: body });
    } catch {
      return undefined;
    }
  }

  private async rest(endpoint: string, body: Record<string, unknown>): Promise<unknown> {
    if (!this.config.apiKey) throw new Error("REST fallback requires ASHBY_API_KEY");
    const url = `${this.config.apiBaseUrl}/${endpoint}`;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const headers: Record<string, string> = {
          Authorization: `Basic ${Buffer.from(`${this.config.apiKey}:`).toString("base64")}`,
          Accept: "application/json; version=1",
          "Content-Type": "application/json"
        };
        if (this.config.onBehalfOfUserId) headers["X-On-Behalf-Of"] = this.config.onBehalfOfUserId;
        const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal });
        const text = await response.text();
        let payload: unknown;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = { raw: text }; }
        if (response.ok) return payload;
        if (!retryable(response.status) || attempt === this.config.maxRetries) {
          throw new Error(`Ashby API ${endpoint} failed (${response.status}): ${text.slice(0, 1000)}`);
        }
        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        await sleep(retryAfter > 0 ? retryAfter * 1000 : Math.min(500 * 2 ** attempt, 4000));
      } catch (error) {
        if (attempt === this.config.maxRetries) {
          if (error instanceof DOMException && error.name === "AbortError") throw new Error(`Ashby API ${endpoint} timed out`);
          throw error;
        }
        await sleep(Math.min(500 * 2 ** attempt, 4000));
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error("Ashby request failed unexpectedly");
  }

  async call(_operation: string, endpoint: string, body: Record<string, unknown>, mcpKeywords: string[]): Promise<unknown> {
    const mcpResult = await this.tryMcp(mcpKeywords, body);
    if (mcpResult !== undefined) return { transport: "official-mcp", result: mcpResult };
    return { transport: "official-rest", result: await this.rest(endpoint, body) };
  }

  async close(): Promise<void> {
    await this.transport?.close().catch(() => undefined);
  }
}
