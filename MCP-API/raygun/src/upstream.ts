import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export interface UpstreamTool {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
}

export interface RaygunUpstream {
  connect(): Promise<void>;
  listTools(): Promise<UpstreamTool[]>;
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms.`)), timeoutMs);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export class OfficialRaygunMcpClient implements RaygunUpstream {
  private readonly client = new Client({ name:"ai-engineering-raygun-connector", version:"1.0.0" }, { capabilities:{} });
  private transport?: StreamableHTTPClientTransport;
  private connected = false;

  constructor(private readonly config: Config) {}

  async connect(): Promise<void> {
    if (this.connected) return;
    this.transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: {
        headers: {
          Authorization: `Bearer ${this.config.pat}`,
          "User-Agent": "ai-engineering-raygun-mcp-connector/1.0.0"
        }
      }
    });
    try {
      await withTimeout(this.client.connect(this.transport), this.config.timeoutMs, "Raygun MCP connection");
      this.connected = true;
    } catch (error) {
      await this.safeClose();
      throw this.mapError(error);
    }
  }

  async listTools(): Promise<UpstreamTool[]> {
    await this.connect();
    try {
      const response = await withTimeout(this.client.listTools(), this.config.timeoutMs, "Raygun tools/list");
      return response.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema as Record<string, unknown>
      }));
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    try {
      return await withTimeout(this.client.callTool({ name, arguments: args }), this.config.timeoutMs, `Raygun ${name}`);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async close(): Promise<void> { await this.safeClose(); }

  private async safeClose(): Promise<void> {
    this.connected = false;
    try { await this.client.close(); } catch { /* best-effort cleanup */ }
  }

  private mapError(error: unknown): Error {
    const message = error instanceof Error ? error.message : String(error);
    if (/401|unauthori[sz]ed|authentication/i.test(message)) return new Error("Raygun authentication failed. Verify or renew RAYGUN_PAT.");
    if (/403|forbidden|scope|permission/i.test(message)) return new Error("Raygun denied the operation. Verify PAT scopes and plan/application access.");
    if (/429|rate.?limit|too many requests/i.test(message)) return new Error(`Raygun rate limit reached. ${message}`);
    if (/timed out|timeout/i.test(message)) return new Error(message);
    return new Error(`Raygun MCP request failed: ${message}`);
  }
}
