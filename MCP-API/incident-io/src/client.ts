import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export class IncidentIoClient {
  private client: Client;
  private transport: StreamableHTTPClientTransport;
  private connected = false;
  constructor(private apiKey: string, endpoint = "https://mcp.incident.io/mcp", private timeoutMs = 20000) {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" || url.hostname !== "mcp.incident.io") throw new Error("INCIDENT_IO_MCP_URL must be https://mcp.incident.io/mcp (path may only be /mcp)");
    if (url.pathname !== "/mcp") throw new Error("INCIDENT_IO_MCP_URL path must be /mcp");
    this.client = new Client({ name: "ai-engineering-incident-io", version: "1.0.0" });
    this.transport = new StreamableHTTPClientTransport(url, { requestInit: { headers: { Authorization: `Bearer ${apiKey}` } } });
  }
  async connect() { if (!this.connected) { await this.client.connect(this.transport); this.connected = true; } }
  async call(name: string, args: Record<string, unknown>) {
    await this.connect();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await this.client.callTool({ name, arguments: args }, undefined, { signal: controller.signal, timeout: this.timeoutMs, resetTimeoutOnProgress: true });
    } finally { clearTimeout(timer); }
  }
  async close() { if (this.connected) await this.client.close(); this.connected = false; }
}
