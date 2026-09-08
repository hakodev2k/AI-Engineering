#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { HightouchClient } from './client.js';
import { registerTools } from './tools.js';

const server = new McpServer({ name: 'hightouch-connector', version: '1.0.0' });
const client = new HightouchClient();
registerTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    await server.close();
    process.exit(0);
  });
}
