import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const ALLOWED = new Set([
  "list_projects", "describe_project", "create_project",
  "list_branches", "describe_branch", "create_branch",
  "list_databases", "create_database", "list_roles",
  "list_branch_computes", "list_operations"
]);

export class NeonOfficialMcp {
  private client?: Client;
  private toolNames?: Set<string>;
  available(): boolean { return Boolean(process.env.NEON_MCP_ACCESS_TOKEN) && !/^false$/i.test(process.env.NEON_PREFER_MCP || "true"); }

  private async connect(): Promise<void> {
    if (this.client) return;
    const endpoint = process.env.NEON_MCP_URL || "https://mcp.neon.tech/sse";
    if (!endpoint.startsWith("https://mcp.neon.tech/")) throw new Error("Refusing an untrusted Neon MCP endpoint.");
    const token = process.env.NEON_MCP_ACCESS_TOKEN;
    if (!token) throw new Error("NEON_MCP_ACCESS_TOKEN is not configured.");
    const client = new Client({ name: "neon-reusable-connector", version: "1.0.0" });
    const transport = new SSEClientTransport(new URL(endpoint), { requestInit: { headers: { Authorization: `Bearer ${token}` } } });
    await client.connect(transport);
    const listed = await client.listTools();
    this.toolNames = new Set(listed.tools.map(t => t.name).filter(n => ALLOWED.has(n)));
    this.client = client;
  }

  async callIfAllowed(name: string, args: Record<string, unknown>): Promise<{ handled: boolean; data?: unknown }> {
    if (!this.available() || !ALLOWED.has(name)) return { handled: false };
    try {
      await this.connect();
      if (!this.toolNames?.has(name)) return { handled: false };
      const result = await this.client!.callTool({ name, arguments: args });
      if (result.isError) return { handled: false };
      return { handled: true, data: result };
    } catch {
      return { handled: false };
    }
  }
}
