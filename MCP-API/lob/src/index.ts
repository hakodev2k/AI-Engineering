import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./auth/config.js";
import { buildServer } from "./server/server.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const server = buildServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Lob connector failed: ${message}`);
  process.exitCode = 1;
});
