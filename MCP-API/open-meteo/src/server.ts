import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { OpenMeteoClient } from "./client.js";
import { loadConfig } from "./config.js";
import { registerTools } from "./tools.js";

export async function main(): Promise<void> {
  const client = new OpenMeteoClient(loadConfig());
  const server = new McpServer({ name: "open-meteo-connector", version: "1.0.0" });
  registerTools(server, client);
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`Open-Meteo connector failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
