import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { RevenueCatConfig } from "../auth/config.js";

export class RevenueCatError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfterMs?: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "RevenueCatError";
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function retryAfterMs(response: Response): number | undefined {
  const raw = response.headers.get("retry-after");
  if (!raw) return undefined;
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(raw);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

export class RevenueCatClient {
  private mcp?: Client;

  constructor(private readonly config: RevenueCatConfig) {}

  async connectMcp(): Promise<void> {
    if (this.mcp) return;
    const client = new Client({ name: "revenuecat-reusable-connector", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
      },
    });
    await client.connect(transport);
    this.mcp = client;
  }

  async close(): Promise<void> {
    if (this.mcp) await this.mcp.close();
    this.mcp = undefined;
  }

  async callOfficialMcp(tool: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connectMcp();
    const response = await this.mcp!.callTool({ name: tool, arguments: args });
    if (response.isError) {
      throw new RevenueCatError(`RevenueCat MCP tool ${tool} failed`, undefined, undefined, response);
    }
    return response;
  }

  async rest<T>(method: "GET" | "POST" | "DELETE" | "PATCH", path: string, body?: unknown): Promise<T> {
    if (!path.startsWith("/")) throw new Error("REST path must begin with /");
    const url = `${this.config.apiBaseUrl}${path}`;
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });

        const text = await response.text();
        let parsed: unknown = undefined;
        if (text) {
          try { parsed = JSON.parse(text); } catch { parsed = text; }
        }

        if (response.ok) return parsed as T;

        const retryMs = retryAfterMs(response);
        const error = new RevenueCatError(
          `RevenueCat API ${method} ${path} failed with ${response.status}`,
          response.status,
          retryMs,
          parsed,
        );

        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt === this.config.maxRetries) throw error;
        await sleep(retryMs ?? Math.min(250 * 2 ** attempt, 2000));
      } catch (error) {
        lastError = error;
        if (error instanceof RevenueCatError) throw error;
        if (attempt === this.config.maxRetries) {
          if (error instanceof Error && error.name === "AbortError") {
            throw new RevenueCatError(`RevenueCat API ${method} ${path} timed out`);
          }
          throw error;
        }
        await sleep(Math.min(250 * 2 ** attempt, 2000));
      } finally {
        clearTimeout(timeout);
      }
    }

    throw lastError instanceof Error ? lastError : new Error("RevenueCat request failed");
  }
}
