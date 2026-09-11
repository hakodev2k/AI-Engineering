import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { FreshserviceConfig } from "./config.js";

export interface Upstream {
  call(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export class FreshserviceUpstream implements Upstream {
  private client?: Client;
  constructor(private readonly config: FreshserviceConfig) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const client = new Client({ name: "ai-engineering-freshservice-connector", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(`https://${this.config.domain}/mcp`), {
      requestInit: { headers: { Authorization: this.config.apiKey } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    const client = await this.getClient();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      return await client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
  }
}
