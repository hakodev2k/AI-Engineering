import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "../auth/config.js";
import { FireHydrantClient } from "../client/firehydrant-client.js";
import { registerTools } from "../tools/register.js";

export function createServer() {
  const config = loadConfig();
  const server = new McpServer({ name: "firehydrant-connector", version: "1.0.0" });
  registerTools(server, new FireHydrantClient(config), config);
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
