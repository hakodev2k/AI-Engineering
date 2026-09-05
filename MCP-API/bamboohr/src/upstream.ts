import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";
import { UPSTREAM_ALLOWLIST } from "./tools.js";

export type UpstreamTool = { name: string; description?: string; inputSchema: Record<string, unknown> };

export class BambooHrUpstream {
  private client?: Client;
  private tools = new Map<string, UpstreamTool>();
  constructor(private readonly config: Config) {}

  async connect(): Promise<void> {
    if (this.client) return;
    const client = new Client({ name: "bamboohr-safe-wrapper", version: "1.0.0" }, { capabilities: {} });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.endpoint), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.accessToken}` } }
    });
    await withTimeout(client.connect(transport), this.config.timeoutMs);
    const listed = await withTimeout(client.listTools(), this.config.timeoutMs);
    for (const tool of listed.tools) {
      if (UPSTREAM_ALLOWLIST.has(tool.name)) {
        this.tools.set(tool.name, {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema as Record<string, unknown>
        });
      }
    }
    this.client = client;
  }

  async getTool(name: string): Promise<UpstreamTool> {
    await this.connect();
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Required official BambooHR MCP tool is unavailable: ${name}`);
    return tool;
  }

  async listAllowedTools(): Promise<UpstreamTool[]> {
    await this.connect();
    return [...this.tools.values()];
  }

  async call(name: string, args: Record<string, unknown>, readOnly: boolean): Promise<unknown> {
    await this.connect();
    if (!UPSTREAM_ALLOWLIST.has(name)) throw new Error("Upstream tool is not allowlisted");
    if (!this.client) throw new Error("BambooHR MCP client is not connected");

    let attempt = 0;
    while (true) {
      try {
        return await withTimeout(this.client.callTool({ name, arguments: args }), this.config.timeoutMs);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const transient = /(429|503|rate.?limit|temporar|timeout|timed out|ECONNRESET|fetch failed)/i.test(message);
        if (!readOnly || !transient || attempt >= this.config.maxReadRetries) throw error;
        const delay = Math.min(250 * 2 ** attempt, 2000);
        attempt += 1;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
    this.tools.clear();
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`BambooHR MCP operation timed out after ${timeoutMs}ms`)), timeoutMs);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
