import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  "search",
  "list_workspaces",
  "browse_workspace",
  "get_sheet_summary",
  "get_sheet_version",
  "find_in_sheet",
  "get_columns",
  "create_sheet",
  "add_rows",
  "update_rows",
  "list_discussions",
  "add_comment",
  "list_reports"
]);

export class SmartsheetMcpClient {
  private client?: Client;
  private connecting?: Promise<Client>;

  constructor(private readonly config: Config) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    if (!this.connecting) {
      this.connecting = (async () => {
        const client = new Client({ name: "ai-engineering-smartsheet-connector", version: "1.0.0" });
        const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
          requestInit: { headers: { Authorization: `Bearer ${this.config.apiToken}` } }
        });
        await client.connect(transport);
        const advertised = new Set((await client.listTools()).tools.map(t => t.name));
        for (const name of ALLOWED_UPSTREAM_TOOLS) {
          if (!advertised.has(name)) {
            await client.close().catch(() => undefined);
            throw new Error(`Official Smartsheet MCP did not advertise required tool: ${name}`);
          }
        }
        this.client = client;
        return client;
      })().finally(() => { this.connecting = undefined; });
    }
    return this.connecting;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Smartsheet MCP tool is not allowlisted: ${name}`);
    const client = await this.getClient();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const result = await client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
      if (result.isError) throw new Error(`Smartsheet MCP ${name} returned an error.`);
      return { untrusted_provider_data: true, data: result.structuredContent ?? result.content };
    } finally {
      clearTimeout(timer);
    }
  }

  async close(): Promise<void> {
    await this.client?.close().catch(() => undefined);
    this.client = undefined;
  }
}
