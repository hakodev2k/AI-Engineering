import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { HelpScoutTokenProvider } from "./auth.js";
import { HelpScoutClient } from "./client.js";
import { registerTools } from "./tools.js";

export function createServer(env: NodeJS.ProcessEnv = process.env, fetchFn: typeof fetch = fetch) {
  const config = loadConfig(env);
  const tokenProvider = new HelpScoutTokenProvider(config, fetchFn);
  const client = new HelpScoutClient(config, tokenProvider, fetchFn);
  const server = new McpServer({ name: "help-scout", version: "1.0.0" });
  const toolNames = registerTools(server, client, config);
  return { server, toolNames, config, client };
}

async function main(): Promise<void> {
  const { server } = createServer();
  await server.connect(new StdioServerTransport());
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
