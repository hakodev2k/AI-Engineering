import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const ALLOWED = new Set(["convertFile", "optimizeFile", "pdfOcr", "captureWebsite", "getUser", "getJobs", "getJob", "getTask"]);

export class OfficialMcpBridge {
  private client?: Client;
  private tools?: Map<string, any>;
  available(): boolean { return Boolean(process.env.CLOUDCONVERT_MCP_ACCESS_TOKEN) && !/^false$/i.test(process.env.CLOUDCONVERT_PREFER_MCP || "true"); }

  private async connect(): Promise<void> {
    if (this.client) return;
    const token = process.env.CLOUDCONVERT_MCP_ACCESS_TOKEN;
    if (!token) throw new Error("CLOUDCONVERT_MCP_ACCESS_TOKEN is not configured.");
    const endpoint = process.env.CLOUDCONVERT_MCP_URL || "https://mcp.cloudconvert.com";
    if (endpoint !== "https://mcp.cloudconvert.com") throw new Error("Refusing an untrusted CloudConvert MCP endpoint.");
    const client = new Client({ name: "cloudconvert-reusable-connector", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(endpoint), { requestInit: { headers: { Authorization: `Bearer ${token}` } } });
    await client.connect(transport);
    const listed = await client.listTools();
    this.tools = new Map(listed.tools.filter(t => ALLOWED.has(t.name)).map(t => [t.name, t]));
    this.client = client;
  }

  async callIfCompatible(toolName: string, args: Record<string, unknown>): Promise<{ handled: boolean; data?: unknown }> {
    if (!this.available() || !ALLOWED.has(toolName)) return { handled: false };
    try {
      await this.connect();
      const tool = this.tools?.get(toolName);
      if (!tool) return { handled: false };
      const props = new Set(Object.keys(tool.inputSchema?.properties || {}));
      if (Object.keys(args).some(k => !props.has(k))) return { handled: false };
      const result = await this.client!.callTool({ name: toolName, arguments: args });
      if (result.isError) throw new Error(`Official MCP tool ${toolName} returned an error.`);
      return { handled: true, data: result };
    } catch {
      return { handled: false };
    }
  }
}
