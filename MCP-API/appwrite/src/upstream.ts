import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

const ALLOWED_PUBLIC = new Set(["appwrite_get_context", "appwrite_call_tool", "appwrite_search_docs"]);
const ALLOWED_HIDDEN = new Set([
  "users_list", "users_get", "users_create", "users_update_name", "users_delete",
  "storage_list_buckets", "storage_get_bucket", "storage_create_bucket", "storage_delete_bucket",
  "functions_list", "functions_get", "functions_create", "functions_delete", "functions_create_execution"
]);

export class AppwriteMcpClient {
  private client?: Client;
  constructor(private c: Config) {}
  available() { return Boolean(this.c.mcpAccessToken); }

  private async getClient() {
    if (this.client) return this.client;
    if (!this.available()) throw new Error("Official Appwrite MCP OAuth token is not configured.");
    const client = new Client({ name: "ai-engineering-appwrite-connector", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(this.c.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.c.mcpAccessToken}` } }
    });
    await client.connect(transport);
    this.client = client;
    return client;
  }

  async publicTool(name: string, args: Record<string, unknown>) {
    if (!ALLOWED_PUBLIC.has(name)) throw new Error("Upstream Appwrite MCP public tool is not allowlisted.");
    const c = await this.getClient();
    return c.callTool({ name, arguments: args });
  }

  async hiddenTool(name: string, args: Record<string, unknown>, confirmWrite: boolean) {
    if (!ALLOWED_HIDDEN.has(name)) throw new Error("Upstream Appwrite MCP hidden tool is not allowlisted.");
    const c = await this.getClient();
    return c.callTool({ name: "appwrite_call_tool", arguments: { tool_name: name, arguments: args, confirm_write: confirmWrite, project_id: this.c.projectId || undefined } });
  }
}
