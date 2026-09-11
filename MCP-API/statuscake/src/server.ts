#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { StatusCakeClient } from "./client.js";
import { registerTools } from "./tools.js";

export async function main(): Promise<void> {
  const config = loadConfig();
  const api = new StatusCakeClient(config);
  const server = new McpServer({ name: "statuscake-connector", version: "1.0.0" });
  registerTools(server, api, config);
  await server.connect(new StdioServerTransport());
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[statuscake-connector] ${message}`);
  process.exitCode = 1;
});
