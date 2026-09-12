import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { MastodonClient } from "./client.js";
import { registerTools } from "./tools.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const client = new MastodonClient(config);
  const server = new McpServer({ name: "mastodon-connector", version: "1.0.0" });
  registerTools(server, client, config);
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(`Mastodon connector failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
