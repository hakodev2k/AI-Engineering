import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const ALLOWED_TOOLS = new Set([
  "get-rooms",
  "get-room",
  "create-room",
  "update-room",
  "delete-room",
  "get-active-users",
  "get-storage-document",
  "get-yjs-document",
  "get-threads",
  "get-thread",
  "create-thread",
  "mark-thread-as-resolved",
  "delete-thread",
]);

export class LiveblocksUpstream {
  private client?: Client;

  constructor(private readonly env = process.env) {}

  private async connect(): Promise<Client> {
    if (this.client) return this.client;
    const secret = this.env.LIVEBLOCKS_SECRET_KEY?.trim();
    if (!secret) throw new Error("LIVEBLOCKS_SECRET_KEY is required");

    const command = this.env.LIVEBLOCKS_UPSTREAM_COMMAND || "npx";
    const pkg = this.env.LIVEBLOCKS_UPSTREAM_PACKAGE || "liveblocks-mcp-server";
    const transport = new StdioClientTransport({
      command,
      args: command === "npx" ? ["-y", pkg] : [pkg],
      env: { ...process.env, LIVEBLOCKS_SECRET_KEY: secret },
    });
    const client = new Client({ name: "liveblocks-safe-connector", version: "1.0.0" });
    await client.connect(transport);

    const discovered = await client.listTools();
    for (const tool of discovered.tools) {
      if (!ALLOWED_TOOLS.has(tool.name)) {
        process.stderr.write(`Ignoring unreviewed Liveblocks MCP tool: ${tool.name}\n`);
      }
    }
    this.client = client;
    return client;
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_TOOLS.has(name)) throw new Error("UPSTREAM_TOOL_NOT_ALLOWED");
    const client = await this.connect();
    return client.callTool({ name, arguments: args });
  }
}
