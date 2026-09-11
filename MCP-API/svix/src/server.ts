import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { SvixClient } from "./client.js";
import { registerTools } from "./tools.js";

export function createServer(env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch): McpServer {
  const config = loadConfig(env);
  const client = new SvixClient(config, fetchImpl);
  const server = new McpServer({ name: "svix-connector", version: "1.0.0" });
  registerTools(server, client, config);
  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => {
    try { await server.close(); } finally { process.exit(0); }
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : "Svix connector failed");
    process.exit(1);
  });
}
