import Ajv, { type ValidateFunction } from "ajv";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export interface Upstream {
  connect(): Promise<void>;
  callTool(name: string, args: Record<string, unknown>, retryRead: boolean): Promise<unknown>;
  close(): Promise<void>;
}

export class TeamworkUpstream implements Upstream {
  private readonly client = new Client({ name: "daily-teamwork-connector", version: "1.0.0" });
  private readonly validators = new Map<string, ValidateFunction>();
  private readonly ajv = new Ajv({ allErrors: true, strict: false });
  private connected = false;

  constructor(private readonly config: Config, private readonly allowlist: ReadonlySet<string>) {}

  async connect(): Promise<void> {
    if (this.connected) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.bearerToken}` } }
    });
    await this.client.connect(transport);
    const tools = await this.client.listTools();
    const discovered = new Map(tools.tools.map((tool) => [tool.name, tool]));
    for (const name of this.allowlist) {
      const tool = discovered.get(name);
      if (!tool?.inputSchema) throw new Error(`Required official Teamwork MCP tool '${name}' is unavailable or has no schema`);
      this.validators.set(name, this.ajv.compile(tool.inputSchema as object));
    }
    this.connected = true;
  }

  async callTool(name: string, args: Record<string, unknown>, retryRead: boolean): Promise<unknown> {
    if (!this.allowlist.has(name)) throw new Error(`Upstream tool '${name}' is not allowlisted`);
    await this.connect();
    const validate = this.validators.get(name);
    if (!validate || !validate(args)) throw new Error(`Invalid arguments for ${name}: ${this.ajv.errorsText(validate?.errors)}`);

    const maxAttempts = retryRead ? this.config.maxReadRetries + 1 : 1;
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        return await this.client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
        const retryable = /429|rate limit|temporar|timeout|timed out|502|503|504/.test(message);
        if (!retryRead || !retryable || attempt === maxAttempts - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, Math.min(250 * 2 ** attempt, 2_000)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }

  async close(): Promise<void> {
    if (this.connected) await this.client.close();
    this.connected = false;
  }
}
