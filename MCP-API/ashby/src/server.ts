import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { AshbyUpstream } from "./upstream.js";
import { registerTools } from "./tools.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const upstream = new AshbyUpstream(config);
  const server = new McpServer({ name: "ashby-connector", version: "1.0.0" });
  registerTools(server, upstream, config);

  const shutdown = async () => {
    await upstream.close().catch(() => undefined);
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`Ashby connector failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
