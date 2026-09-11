import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { CronitorClient } from './client.js';
import { registerCronitorTools } from './tools.js';

export function createServer(env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch): McpServer {
  const config = loadConfig(env);
  const client = new CronitorClient(config, fetchImpl);
  const server = new McpServer({ name: 'cronitor-mcp-connector', version: '1.0.0' });
  registerCronitorTools(server, client, config);
  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
