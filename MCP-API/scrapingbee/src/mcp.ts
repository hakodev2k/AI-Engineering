import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const ALLOWED = new Set([
  "get_page_text","get_page_html","extract_page_data","get_screenshot","fast_search",
  "get_google_search_results","get_scrapingbee_usage"
]);

export class OfficialMcpBridge {
  private client?: Client;
  private tools = new Map<string, any>();
  available(): boolean {
    return Boolean(process.env.SCRAPINGBEE_API_KEY) && !/^false$/i.test(process.env.SCRAPINGBEE_PREFER_MCP || "true");
  }
  private async connect(): Promise<void> {
    if (this.client) return;
    const apiKey = process.env.SCRAPINGBEE_API_KEY;
    if (!apiKey) throw new Error("SCRAPINGBEE_API_KEY is not configured.");
    const base = process.env.SCRAPINGBEE_MCP_URL || "https://mcp.scrapingbee.com/mcp";
    if (base !== "https://mcp.scrapingbee.com/mcp") throw new Error("Refusing untrusted ScrapingBee MCP endpoint.");
    const endpoint = new URL(base); endpoint.searchParams.set("api_key", apiKey);
    const client = new Client({ name:"scrapingbee-reusable-connector", version:"1.0.0" });
    await client.connect(new StreamableHTTPClientTransport(endpoint));
    const listed = await client.listTools();
    this.tools = new Map(listed.tools.filter(t => ALLOWED.has(t.name)).map(t => [t.name,t]));
    this.client = client;
  }
  async call(toolName: string, candidates: Record<string, unknown>): Promise<{handled:boolean; data?:unknown}> {
    if (!this.available() || !ALLOWED.has(toolName)) return { handled:false };
    try {
      await this.connect();
      const tool = this.tools.get(toolName); if (!tool) return { handled:false };
      const props = tool.inputSchema?.properties || {};
      const required = new Set<string>(tool.inputSchema?.required || []);
      const args: Record<string, unknown> = {};
      for (const [k,v] of Object.entries(candidates)) if (v !== undefined && k in props) args[k] = v;
      if ([...required].some(k => !(k in args))) return { handled:false };
      const result = await this.client!.callTool({ name:toolName, arguments:args });
      if (result.isError) return { handled:false };
      return { handled:true, data:result };
    } catch { return { handled:false }; }
  }
}
