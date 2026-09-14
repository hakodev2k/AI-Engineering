import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const ALLOWED = new Set(["tavily-search", "tavily-extract", "tavily-map", "tavily-crawl"]);

export class OfficialTavilyMcp {
  private client?: Client;
  private tools = new Map<string, any>();
  available(): boolean { return Boolean(process.env.TAVILY_API_KEY) && !/^false$/i.test(process.env.TAVILY_PREFER_MCP || "true"); }

  private async connect(): Promise<void> {
    if (this.client) return;
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) throw new Error("TAVILY_API_KEY is not configured.");
    const endpoint = process.env.TAVILY_MCP_URL || "https://mcp.tavily.com/mcp/";
    if (!endpoint.startsWith("https://mcp.tavily.com/mcp")) throw new Error("Refusing an untrusted Tavily MCP endpoint.");
    const client = new Client({ name: "tavily-reusable-connector", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(endpoint), { requestInit: { headers: { Authorization: `Bearer ${apiKey}` } } });
    await client.connect(transport);
    const listed = await client.listTools();
    this.tools = new Map(listed.tools.filter(t => ALLOWED.has(t.name)).map(t => [t.name, t]));
    this.client = client;
  }

  async call(toolName: string, args: Record<string, unknown>): Promise<{ handled: boolean; data?: unknown }> {
    if (!this.available() || !ALLOWED.has(toolName)) return { handled: false };
    try {
      await this.connect();
      const tool = this.tools.get(toolName);
      if (!tool) return { handled: false };
      const props = new Set(Object.keys(tool.inputSchema?.properties || {}));
      if (Object.keys(args).some(k => !props.has(k))) return { handled: false };
      const result = await this.client!.callTool({ name: toolName, arguments: args });
      if (result.isError) return { handled: false };
      return { handled: true, data: result };
    } catch { return { handled: false }; }
  }
}
