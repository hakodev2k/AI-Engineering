import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

const ALLOWED_MCP_TOOLS = new Set([
  "getConfluenceSpaces",
  "getPagesInConfluenceSpace",
  "getConfluencePage",
  "searchConfluenceUsingCql",
  "getConfluencePageDescendants",
  "getConfluencePageFooterComments",
  "getConfluencePageInlineComments",
  "createConfluencePage",
  "updateConfluencePage",
  "createConfluenceFooterComment",
  "createConfluenceInlineComment"
]);

export class Upstream {
  private mcp?: Client;
  constructor(private readonly config: Config) {}

  private async mcpClient(): Promise<Client> {
    if (!this.config.mcpToken) throw new Error("MCP_NOT_CONFIGURED");
    if (this.mcp) return this.mcp;
    const client = new Client({ name: "confluence-connector", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: { headers: { Authorization: `Bearer ${this.config.mcpToken}` } }
    });
    await client.connect(transport);
    this.mcp = client;
    return client;
  }

  async callMcp(tool: string, args: Record<string, unknown>): Promise<unknown> {
    if (!ALLOWED_MCP_TOOLS.has(tool)) throw new Error(`MCP_TOOL_NOT_ALLOWED: ${tool}`);
    const client = await this.mcpClient();
    return client.callTool({ name: tool, arguments: { cloudId: this.config.cloudId, ...args } });
  }

  private async rest(path: string, init: RequestInit = {}, safeRetry = true): Promise<unknown> {
    if (!(this.config.siteUrl && this.config.email && this.config.apiToken)) throw new Error("REST_NOT_CONFIGURED");
    const url = new URL(path, `${this.config.siteUrl}/wiki/api/v2/`);
    const auth = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString("base64");
    const attempts = safeRetry ? 3 : 1;
    let last: Error | undefined;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await fetch(url, {
          ...init,
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
            ...(init.headers ?? {})
          }
        });
        const text = await response.text();
        const body = text ? JSON.parse(text) : null;
        if (response.ok) return body;
        const retryable = safeRetry && (response.status === 429 || response.status >= 500);
        if (!retryable || attempt === attempts - 1) {
          const retryAfter = response.headers.get("retry-after");
          throw new Error(`ATLASSIAN_${response.status}${retryAfter ? `_RETRY_AFTER_${retryAfter}` : ""}: ${text.slice(0, 500)}`);
        }
        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        await new Promise(r => setTimeout(r, retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt));
      } catch (error) {
        last = error instanceof Error ? error : new Error(String(error));
        if (attempt === attempts - 1) throw last;
      } finally {
        clearTimeout(timer);
      }
    }
    throw last ?? new Error("REST_REQUEST_FAILED");
  }

  async read(mcpTool: string, mcpArgs: Record<string, unknown>, restPath: string): Promise<unknown> {
    if (this.config.mcpToken) return this.callMcp(mcpTool, mcpArgs);
    return this.rest(restPath, { method: "GET" }, true);
  }

  async write(mcpTool: string, mcpArgs: Record<string, unknown>, restPath: string, method: "POST" | "PUT", body: unknown): Promise<unknown> {
    if (this.config.mcpToken) return this.callMcp(mcpTool, mcpArgs);
    return this.rest(restPath, { method, body: JSON.stringify(body) }, false);
  }
}
