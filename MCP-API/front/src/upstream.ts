import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";
import { CredentialProvider } from "./auth.js";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class FrontMcpClient {
  constructor(private readonly config: Config, private readonly credentials: CredentialProvider) {}

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    let last: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      let client: Client | undefined;
      try {
        const token = await this.credentials.getAccessToken(controller.signal);
        const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
          requestInit: { headers: { authorization: `Bearer ${token}` }, signal: controller.signal }
        });
        client = new Client({ name:"ai-engineering-front-connector", version:"1.0.0" });
        await client.connect(transport);
        const listed = await client.listTools();
        if (!listed.tools.some(t => t.name === name)) throw new Error(`Front official MCP tool '${name}' is not currently exposed; beta tool catalog may have changed.`);
        return await client.callTool({ name, arguments: args });
      } catch (error) {
        last = error;
        const text = error instanceof Error ? error.message : String(error);
        const auth = /401|unauthori|invalid token/i.test(text);
        const rate = /429|rate.?limit|too many/i.test(text);
        const transient = rate || /502|503|504|timeout|network|fetch failed|ECONNRESET/i.test(text);
        if (auth) this.credentials.invalidate();
        if ((!auth && !transient) || attempt === this.config.maxRetries) throw error;
        await sleep(Math.min(5000, 500 * 2 ** attempt));
      } finally {
        clearTimeout(timer);
        try { await client?.close(); } catch { }
      }
    }
    throw last;
  }
}
