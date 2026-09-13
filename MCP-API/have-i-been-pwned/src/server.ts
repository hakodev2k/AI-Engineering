import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HibpClient } from "./client.js";
import { loadConfig } from "./config.js";
import { registerTools } from "./tools.js";

function permissionsFromEnv(value: string | undefined): Set<string> | undefined {
  if (!value?.trim()) return undefined;
  return new Set(value.split(",").map((item) => item.trim()).filter(Boolean));
}

export async function main(): Promise<void> {
  const config = loadConfig();
  const client = new HibpClient(config);
  const server = new McpServer({ name: "have-i-been-pwned-connector", version: "1.0.0" });
  registerTools(server, client, permissionsFromEnv(process.env.HIBP_ALLOWED_PERMISSIONS));

  const shutdown = async () => {
    await client.close().catch(() => undefined);
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`Have I Been Pwned connector failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
