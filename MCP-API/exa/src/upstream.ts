import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";

export type Upstream = { call(tool: string, args: Record<string, unknown>): Promise<unknown>; close(): Promise<void> };

const ALLOWED = new Set(["web_search_exa", "web_search_advanced_exa", "web_fetch_exa", "agent_run"]);

export async function connectExa(config: Config): Promise<Upstream> {
  const url = new URL("https://mcp.exa.ai/mcp");
  url.searchParams.set("tools", [...ALLOWED].join(","));
  const requestInit: RequestInit = { headers: {} };
  if (config.apiKey) (requestInit.headers as Record<string, string>)["x-api-key"] = config.apiKey;

  const transport = new StreamableHTTPClientTransport(url, { requestInit });
  const client = new Client({ name: "ai-engineering-exa-connector", version: "1.0.0" });
  await client.connect(transport);

  return {
    async call(tool, args) {
      if (!ALLOWED.has(tool)) throw new Error("Upstream tool is not allowlisted");
      let last: unknown;
      for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), config.timeoutMs);
        try {
          return await client.callTool({ name: tool, arguments: args }, undefined, { signal: controller.signal });
        } catch (error) {
          last = error;
          if (attempt >= config.maxRetries || controller.signal.aborted || !isRetryable(error)) throw error;
          await new Promise(r => setTimeout(r, 250 * 2 ** attempt));
        } finally {
          clearTimeout(timer);
        }
      }
      throw last;
    },
    close: () => client.close()
  };
}

function isRetryable(error: unknown): boolean {
  const text = String(error).toLowerCase();
  return text.includes("429") || text.includes("rate") || text.includes("timeout") || text.includes("network") || text.includes("503") || text.includes("502");
}
