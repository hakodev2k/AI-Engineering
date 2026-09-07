import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { CannyClient } from './client.js';
import { registerTools } from './tools.js';

async function main() {
  const config = loadConfig();
  const server = new McpServer({ name: 'canny-connector', version: '1.0.0' });
  const client = new CannyClient(config);
  registerTools(server, client, config.requireWriteApproval);
  await server.connect(new StdioServerTransport());
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
