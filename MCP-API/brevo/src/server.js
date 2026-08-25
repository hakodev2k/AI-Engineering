import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { BrevoClient } from './client.js';
import { registerTools } from './tools.js';

export function createServer({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  const config = loadConfig(env);
  const client = new BrevoClient(config, fetchImpl);
  const server = new McpServer({ name: 'brevo-connector', version: '1.0.0' });
  registerTools(server, client, config);
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
