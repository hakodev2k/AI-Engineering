import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const ALLOWED = new Set(["getApplications", "listIndices", "getSettings", "searchSingleIndex", "getTopSearches", "getNoResultsRate"]);

export class AlgoliaMcpClient {
  private client?: Client;
  async connect() {
    if (this.client) return;
    const url = new URL(process.env.ALGOLIA_MCP_URL ?? "https://mcp.algolia.com/mcp");
    if (url.protocol !== "https:" || url.hostname !== "mcp.algolia.com") throw new Error("ALGOLIA_MCP_URL must use the official HTTPS host");
    const token = process.env.ALGOLIA_MCP_ACCESS_TOKEN;
    if (!token) throw new Error("ALGOLIA_MCP_ACCESS_TOKEN is required for Productivity MCP");
    const transport = new StreamableHTTPClientTransport(url, { requestInit: { headers: { Authorization: `Bearer ${token}` } } });
    this.client = new Client({ name: "daily-algolia-connector", version: "1.0.0" });
    await this.client.connect(transport);
  }
  async call(name: string, args: Record<string, unknown>) {
    if (!ALLOWED.has(name)) throw new Error("Upstream MCP tool is not allowlisted");
    await this.connect();
    return this.client!.callTool({ name, arguments: args });
  }
}
