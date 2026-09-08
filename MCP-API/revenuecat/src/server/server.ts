import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RevenueCatClient } from "../client/revenuecat.js";
import { loadConfig, type RevenueCatConfig } from "../auth/config.js";
import { registerTools } from "../tools/register.js";

export type BuiltServer = {
  server: McpServer;
  client: RevenueCatClient;
  config: RevenueCatConfig;
  tools: string[];
};

export function buildServer(env: NodeJS.ProcessEnv = process.env): BuiltServer {
  const config = loadConfig(env);
  const client = new RevenueCatClient(config);
  const server = new McpServer({
    name: "revenuecat-connector",
    version: "1.0.0",
  });

  const tools = registerTools(server, client, config);
  return { server, client, config, tools };
}
