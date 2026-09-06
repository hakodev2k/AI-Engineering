import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export interface UpstreamTool {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
}

export interface Upstream {
  listTools(): Promise<UpstreamTool[]>;
  callTool(name: string, args: Record<string, unknown>, readOnly: boolean): Promise<unknown>;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class CloseOfficialMcp implements Upstream {
  constructor(private readonly config: Config) {}

  async listTools(): Promise<UpstreamTool[]> {
    return this.withClient(async client => {
      const result = await client.listTools();
      return result.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema as Record<string, unknown>
      }));
    });
  }

  async callTool(name: string, args: Record<string, unknown>, readOnly: boolean): Promise<unknown> {
    const attempts = readOnly ? this.config.maxReadRetries + 1 : 1;
    let lastError: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return await this.withClient(client => client.callTool({ name, arguments: args }));
      } catch (error) {
        lastError = error;
        if (!readOnly || attempt + 1 >= attempts || !this.isRetryable(error)) break;
        await sleep(Math.min(500 * 2 ** attempt, 4000));
      }
    }
    throw lastError;
  }

  private async withClient<T>(operation: (client: Client) => Promise<T>): Promise<T> {
    const client = new Client({ name:"close-curated-connector", version:"1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.upstreamUrl), {
      requestInit: {
        headers: {
          "Close-API-Key": this.config.apiKey,
          "Close-Scope": this.config.upstreamScope
        }
      }
    });

    const timeout = new Promise<never>((_, reject) => {
      const timer = setTimeout(() => reject(new Error(`Close MCP request timed out after ${this.config.timeoutMs}ms.`)), this.config.timeoutMs);
      timer.unref?.();
    });

    try {
      await Promise.race([client.connect(transport), timeout]);
      return await Promise.race([operation(client), timeout]);
    } finally {
      await transport.close().catch(() => undefined);
    }
  }

  private isRetryable(error: unknown): boolean {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    return message.includes("429") || message.includes("rate") || message.includes("timeout") || message.includes("temporar") || message.includes("503") || message.includes("502");
  }
}
