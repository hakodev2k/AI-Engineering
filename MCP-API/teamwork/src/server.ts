import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { TeamworkUpstream } from "./upstream.js";
import { registerTools, UPSTREAM_ALLOWLIST } from "./tools.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const upstream = new TeamworkUpstream(config, UPSTREAM_ALLOWLIST);
  const server = new McpServer({ name: "teamwork-connector", version: "1.0.0" });
  registerTools(server, upstream, config);

  const shutdown = async (): Promise<void> => {
    await upstream.close().catch(() => undefined);
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Teamwork connector failed: ${message}`);
    process.exit(1);
  });
}
