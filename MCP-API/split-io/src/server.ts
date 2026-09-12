import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { SplitClient } from "./client.js";
import { registerTools } from "./tools.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const client = new SplitClient(config);
  const server = new McpServer({ name: "split-io-connector", version: "1.0.0" });
  registerTools(server, client, config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Split.io connector failed: ${message}`);
    process.exit(1);
  });
}
