import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { VultrClient } from "./client.js";
import { registerVultrTools } from "./tools.js";

export function createServer({ config = loadConfig(), fetchImpl = globalThis.fetch } = {}) {
  const server = new McpServer({ name: "vultr-safe-connector", version: "1.0.0" });
  const client = new VultrClient(config, fetchImpl);
  registerVultrTools(server, client, config);
  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch(error => {
    console.error(`Vultr connector failed: ${error?.message || error}`);
    process.exitCode = 1;
  });
}
