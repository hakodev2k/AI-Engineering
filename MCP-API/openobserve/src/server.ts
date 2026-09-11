import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { OpenObserveRestClient } from "./rest.js";
import { OpenObserveMcpClient } from "./upstream.js";
import { registerTools } from "./tools.js";

export function buildServer() {
  const config = loadConfig();
  const rest = new OpenObserveRestClient(config);
  const upstream = new OpenObserveMcpClient(config);
  const server = new McpServer({ name: "openobserve-connector", version: "1.0.0" });
  registerTools(server, { config, rest, upstream });
  return { server, upstream };
}

async function main() {
  const { server, upstream } = buildServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => {
    await upstream.close();
    await server.close();
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
