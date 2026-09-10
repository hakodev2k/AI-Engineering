import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export class PlanetScaleUpstream {
  private client = new Client({ name: "planetscale-safe-connector", version: "1.0.0" });
  private connected = false;
  private advertised = new Set<string>();
  constructor(private config: Config) {}

  async connect() {
    if (this.connected) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.PLANETSCALE_MCP_URL), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.PLANETSCALE_MCP_TOKEN}` } }
    });
    await this.client.connect(transport);
    const listed = await this.client.listTools();
    this.advertised = new Set(listed.tools.map(t => t.name));
    this.connected = true;
  }

  async call(name: string, args: Record<string, unknown>, retryable: boolean) {
    await this.connect();
    if (!this.advertised.has(name)) throw new Error(`Required official PlanetScale MCP tool is unavailable: ${name}`);
    let last: unknown;
    const attempts = retryable ? this.config.PLANETSCALE_MAX_RETRIES + 1 : 1;
    for (let i=0;i<attempts;i++) {
      try {
        return await Promise.race([
          this.client.callTool({ name, arguments: args }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("PlanetScale MCP timeout")), this.config.PLANETSCALE_TIMEOUT_MS))
        ]);
      } catch (e) {
        last = e;
        const msg = String(e).toLowerCase();
        if (!retryable || !(msg.includes("429") || msg.includes("timeout") || msg.includes("temporar") || msg.includes("503") || msg.includes("502"))) throw e;
        if (i + 1 < attempts) await new Promise(r => setTimeout(r, Math.min(4000, 250 * 2 ** i)));
      }
    }
    throw last;
  }
}
