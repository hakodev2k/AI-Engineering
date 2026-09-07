import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ShippoClient } from "./client.js";
import { loadConfig } from "./config.js";
import { buildTools } from "./tools.js";

export async function createServer(env: NodeJS.ProcessEnv = process.env, fetcher: typeof fetch = fetch) {
  const config = loadConfig(env);
  const server = new McpServer({ name: "shippo-connector", version: "1.0.0" });
  const client = new ShippoClient(config, fetcher);
  for (const tool of buildTools(client, config)) {
    server.tool(tool.name, tool.description, tool.schema as any, async (args: any) => {
      try {
        const result = await tool.handler(args);
        return { content: [{ type: "text", text: JSON.stringify({ source: "untrusted-provider-data", data: result }, null, 2) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown connector error";
        return { isError: true, content: [{ type: "text", text: JSON.stringify({ error: message }) }] };
      }
    });
  }
  return server;
}

export async function run() {
  const server = await createServer();
  await server.connect(new StdioServerTransport());
}
