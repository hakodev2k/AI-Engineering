import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { ConnectorConfig } from "./config.js";

export class OpenObserveMcpClient {
  private client?: Client;

  constructor(private readonly config: ConnectorConfig) {}

  private async ensureConnected(): Promise<Client> {
    if (this.client) return this.client;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: this.config.authHeader } }
    });
    const client = new Client({ name: "openobserve-connector", version: "1.0.0" });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const client = await this.ensureConnected();
    const result = await client.callTool({ name, arguments: args });
    if (typeof result === "object" && result !== null && "isError" in result && result.isError === true) {
      throw new Error(`OpenObserve MCP tool ${name} returned an error result`);
    }
    return result;
  }

  async close(): Promise<void> {
    try { await this.client?.close(); } finally { this.client = undefined; }
  }
}
