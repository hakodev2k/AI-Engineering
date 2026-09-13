import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Config } from "./config.js";

export class FormioUpstream {
  private client?: Client;
  private transport?: StdioClientTransport;
  private allowed = new Set<string>();

  constructor(private readonly config: Config, private readonly expectedTools: readonly string[]) {}

  async connect(): Promise<void> {
    if (this.client) return;
    this.transport = new StdioClientTransport({ command: this.config.command, args: this.config.args, env: this.config.env as Record<string, string> });
    this.client = new Client({ name: "formio-connector-upstream", version: "1.0.0" });
    await this.client.connect(this.transport);
    const listing = await this.client.listTools();
    const discovered = new Set(listing.tools.map((tool) => tool.name));
    for (const expected of this.expectedTools) {
      if (!discovered.has(expected)) throw new Error(`UPSTREAM_TOOL_MISSING: official Form.io MCP did not expose expected tool ${expected}`);
      this.allowed.add(expected);
    }
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    if (!this.allowed.has(name)) throw new Error(`UPSTREAM_TOOL_DENIED: ${name}`);
    return this.client!.callTool({ name, arguments: args });
  }

  async close(): Promise<void> {
    await this.transport?.close();
    this.client = undefined;
    this.transport = undefined;
    this.allowed.clear();
  }
}
