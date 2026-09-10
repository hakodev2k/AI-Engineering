import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { GcoreConfig } from "./config.js";
import { TOOLS } from "./policy.js";

export class GcoreUpstream {
  private client = new Client({ name: "gcore-safe-connector", version: "1.0.0" });
  private connected = false;
  private discovered = new Map<string, any>();

  constructor(private readonly config: GcoreConfig) {}

  async connect(): Promise<void> {
    if (this.connected) return;
    const inherited = Object.fromEntries(Object.entries(process.env).filter(([, v]) => typeof v === "string")) as Record<string, string>;
    const env: Record<string, string> = {
      ...inherited,
      GCORE_API_KEY: this.config.apiKey,
      GCORE_BASE_URL: this.config.baseUrl,
      GCORE_TOOLS: Object.values(TOOLS).map((x) => x.raw).join(",")
    };
    if (this.config.projectId) env.GCORE_CLOUD_PROJECT_ID = this.config.projectId;
    if (this.config.regionId) env.GCORE_CLOUD_REGION_ID = this.config.regionId;
    if (this.config.clientId) env.GCORE_CLIENT_ID = this.config.clientId;

    const transport = new StdioClientTransport({
      command: "uvx",
      args: ["--from", "gcore-mcp-server@git+https://github.com/G-Core/gcore-mcp-server.git", "gcore-mcp-server"],
      env
    });
    await this.withTimeout(this.client.connect(transport));
    const listed = await this.withTimeout(this.client.listTools());
    this.discovered = new Map(listed.tools.map((tool) => [tool.name, tool]));
    for (const meta of Object.values(TOOLS)) {
      if (!this.discovered.has(meta.upstream)) {
        throw new Error(`Official Gcore MCP did not advertise required tool ${meta.upstream}`);
      }
    }
    this.connected = true;
  }

  schema(upstreamName: string): Record<string, unknown> {
    const schema = this.discovered.get(upstreamName)?.inputSchema;
    if (!schema || typeof schema !== "object") throw new Error(`Missing input schema for ${upstreamName}`);
    return structuredClone(schema) as Record<string, unknown>;
  }

  async call(upstreamName: string, args: Record<string, unknown>, retryable = false): Promise<unknown> {
    await this.connect();
    const attempts = retryable ? 3 : 1;
    let lastError: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return await this.withTimeout(this.client.callTool({ name: upstreamName, arguments: args }));
      } catch (error) {
        lastError = error;
        if (!retryable || !this.isTransient(error) || attempt === attempts - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, Math.min(2000, 250 * 2 ** attempt)));
      }
    }
    throw lastError;
  }

  private isTransient(error: unknown): boolean {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    return /429|rate.?limit|timeout|timed out|temporar|502|503|504|connection reset|econnreset/.test(message);
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<T>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Gcore MCP request timed out after ${this.config.timeoutMs}ms`)), this.config.timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
