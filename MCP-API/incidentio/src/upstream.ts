import Ajv, { type ValidateFunction } from "ajv";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export interface Upstream {
  connect(): Promise<void>;
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export class IncidentIoUpstream implements Upstream {
  private readonly client = new Client({ name: "daily-incidentio-connector", version: "1.0.0" });
  private readonly validators = new Map<string, ValidateFunction>();
  private connected = false;
  private readonly ajv = new Ajv({ allErrors: true, strict: false });

  constructor(private readonly config: Config) {}

  async connect(): Promise<void> {
    if (this.connected) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.apiKey}` } }
    });
    await this.client.connect(transport);
    const tools = await this.client.listTools();
    for (const tool of tools.tools) {
      if (tool.inputSchema) this.validators.set(tool.name, this.ajv.compile(tool.inputSchema as object));
    }
    this.connected = true;
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    const validate = this.validators.get(name);
    if (!validate) throw new Error(`Upstream tool '${name}' is unavailable or has no input schema`);
    if (!validate(args)) throw new Error(`Invalid arguments for ${name}: ${this.ajv.errorsText(validate.errors)}`);

    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        return await this.client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
        const retryable = /429|rate limit|temporar|timeout|timed out|502|503|504/.test(message);
        if (!retryable || attempt === this.config.maxRetries) throw error;
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
