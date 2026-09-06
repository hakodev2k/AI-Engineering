import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export class WrikeUpstream {
  private readonly client: Client;
  private connected = false;
  constructor(private readonly config: Config) {
    this.client = new Client({ name: "ai-engineering-wrike-adapter", version: "1.0.0" }, { capabilities: {} });
  }

  private async ensureConnected(): Promise<void> {
    if (this.connected) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.accessToken}` } }
    });
    await this.client.connect(transport);
    this.connected = true;
  }

  async listTools() {
    await this.ensureConnected();
    return this.client.listTools();
  }

  async callTool(name: string, args: Record<string, unknown>) {
    await this.ensureConnected();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      return await this.client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }
}
