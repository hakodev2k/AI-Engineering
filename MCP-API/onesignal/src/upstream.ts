import { Client, StreamableHTTPClientTransport, isSpecType } from "@modelcontextprotocol/client";
import type { ConnectorConfig } from "./auth.js";
import type { Upstream, UpstreamTool } from "./types.js";

export class OfficialOneSignalMcp implements Upstream {
  private client: Client | undefined;
  private connectPromise: Promise<Client> | undefined;

  constructor(private readonly config: ConnectorConfig) {}

  private async connected(): Promise<Client> {
    if (this.client) return this.client;
    if (!this.connectPromise) {
      this.connectPromise = (async () => {
        const client = new Client({ name: "ai-engineering-onesignal-connector", version: "1.0.0" });
        const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
          requestInit: { headers: { Authorization: `Bearer ${this.config.accessToken}` } }
        });
        await this.withTimeout(client.connect(transport), "connect");
        this.client = client;
        return client;
      })().finally(() => { this.connectPromise = undefined; });
    }
    return this.connectPromise;
  }

  private async withTimeout<T>(promise: Promise<T>, operation: string): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`OneSignal MCP ${operation} timed out after ${this.config.timeoutMs}ms`)), this.config.timeoutMs);
    });
    try { return await Promise.race([promise, timeout]); }
    finally { if (timer) clearTimeout(timer); }
  }

  async listTools(): Promise<UpstreamTool[]> {
    const client = await this.connected();
    const result = await this.withTimeout(client.listTools(), "tools/list");
    if (!Array.isArray(result.tools)) throw new Error("OneSignal MCP returned an invalid tool list");
    return result.tools.map((tool) => ({
      ...tool,
      inputSchema: tool.inputSchema as UpstreamTool["inputSchema"]
    })) as UpstreamTool[];
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const client = await this.connected();
    const result = await this.withTimeout(client.callTool({ name, arguments: args }), `tools/call ${name}`);
    if (!isSpecType.CallToolResult(result)) throw new Error(`OneSignal MCP returned an invalid result for ${name}`);
    return result;
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close();
    this.client = undefined;
  }
}
