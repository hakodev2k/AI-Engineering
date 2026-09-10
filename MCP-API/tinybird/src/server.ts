import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { TinybirdClient } from "./client.js";
import { TinybirdMcpClient } from "./upstream-mcp.js";
import { Policy } from "./policy.js";
import { registerTools } from "./tools.js";

export async function createServer() {
  const config = loadConfig();
  const server = new McpServer({ name: "tinybird-connector", version: "1.0.0" });
  const api = new TinybirdClient(config);
  const upstream = new TinybirdMcpClient(config);
  const policy = new Policy(config);
  registerTools(server, api, upstream, policy);
  return { server, upstream };
}

async function main(): Promise<void> {
  const { server, upstream } = await createServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => {
    try { await upstream.close(); } finally { process.exit(0); }
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    const message = error instanceof Error ? error.message : "Unknown startup error";
    console.error(`Tinybird connector failed: ${message}`);
    process.exit(1);
  });
}
