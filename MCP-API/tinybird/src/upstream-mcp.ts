import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

const ALLOWED_UPSTREAM_TOOLS = new Set([
  "list_datasources",
  "list_service_datasources",
  "list_endpoints",
  "explore_data",
  "text_to_sql",
  "execute_query"
]);

export class TinybirdMcpClient {
  private client?: Client;

  constructor(private readonly config: Config) {}

  async call(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream MCP tool is not allow-listed: ${name}`);
    const client = await this.getClient();
    return client.callTool({ name, arguments: args });
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
  }

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    const url = new URL(this.config.mcpUrl);
    url.searchParams.set("token", this.config.token);
    if (this.config.apiHost !== "https://api.tinybird.co") url.searchParams.set("host", this.config.apiHost);

    const client = new Client({ name: "ai-engineering-tinybird-connector", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(url);
    await client.connect(transport);
    this.client = client;
    return client;
  }
}
