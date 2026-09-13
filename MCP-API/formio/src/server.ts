import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { registerTools, EXPECTED_UPSTREAM_TOOLS } from "./tools.js";
import { FormioUpstream } from "./upstream.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const upstream = new FormioUpstream(config, EXPECTED_UPSTREAM_TOOLS);
  const server = new McpServer({ name: "formio-connector", version: "1.0.0" });
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
    console.error(`Form.io connector failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
