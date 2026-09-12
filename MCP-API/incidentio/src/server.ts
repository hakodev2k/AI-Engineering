import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { IncidentIoUpstream } from "./upstream.js";
import { registerTools } from "./tools.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const upstream = new IncidentIoUpstream(config);
  const server = new McpServer({ name: "incidentio-connector", version: "1.0.0" });
  registerTools(server, upstream, config);

  const shutdown = async () => {
    await upstream.close().catch(() => undefined);
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`incident.io connector failed: ${message}`);
    process.exit(1);
  });
}
