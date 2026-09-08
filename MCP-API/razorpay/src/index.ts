import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { RazorpayClient } from './client.js';
import { registerTools } from './tools.js';

export function buildServer(env: NodeJS.ProcessEnv = process.env): McpServer {
  const cfg = loadConfig(env);
  const server = new McpServer({ name: 'razorpay-connector', version: '1.0.0' });
  registerTools(server, new RazorpayClient(cfg), cfg);
  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
