import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { KindeClient } from "./client.js";
import { loadConfig } from "./config.js";
import { registerTools } from "./tools.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const client = new KindeClient(config);
  const server = new McpServer({ name: "kinde-connector", version: "1.0.0" });
  registerTools(server, client, config);
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Kinde connector failed: ${message}`);
    process.exit(1);
  });
}
