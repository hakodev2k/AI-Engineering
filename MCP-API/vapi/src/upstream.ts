import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export interface Upstream {
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export class VapiUpstream implements Upstream {
  private client: Client | undefined;
  private connecting: Promise<Client> | undefined;

  constructor(private readonly config: Config) {}

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;
    if (this.connecting) return this.connecting;

    this.connecting = (async () => {
      const client = new Client({ name: "daily-mcp-vapi-connector", version: "1.0.0" }, { capabilities: {} });
      const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
        requestInit: {
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            "Content-Type": "application/json"
          }
        }
      });
      await client.connect(transport);
      const available = await client.listTools();
      const names = new Set(available.tools.map((tool) => tool.name));
      for (const required of ALLOWED_UPSTREAM_TOOLS) {
        if (!names.has(required)) throw new Error(`Required Vapi MCP tool is unavailable: ${required}`);
      }
      this.client = client;
      return client;
    })();

    try {
      return await this.connecting;
    } finally {
      this.connecting = undefined;
    }
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_UPSTREAM_TOOLS.has(name)) throw new Error(`Upstream tool is not allowlisted: ${name}`);
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
    if (this.client) await this.client.close();
    this.client = undefined;
  }
}

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  "list_assistants",
  "create_assistant",
  "get_assistant",
  "list_calls",
  "create_call",
  "get_call",
  "list_phone_numbers",
  "get_phone_number",
  "list_tools",
  "get_tool"
]);
