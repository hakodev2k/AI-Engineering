import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { ConnectorConfig } from "./config.js";

export class OpenObserveMcpClient {
  private client?: Client;
  private transport?: StreamableHTTPClientTransport;

  constructor(private readonly config: ConnectorConfig) {}

  private async ensureConnected(): Promise<Client> {
    if (this.client) return this.client;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: this.config.authHeader } }
    });
    const client = new Client({ name: "openobserve-connector", version: "1.0.0" });
    await client.connect(transport);
    this.client = client;
    this.transport = transport;
    return client;
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const client = await this.ensureConnected();
    return client.callTool({ name, arguments: args });
  }

  async close(): Promise<void> {
    try { await this.client?.close(); } finally {
      this.client = undefined;
      this.transport = undefined;
    }
  }
}
