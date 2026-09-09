import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { FormstackClient } from './client.js';
import { registerTools } from './tools.js';

const cfg = loadConfig();
const api = new FormstackClient(cfg);
const server = new McpServer({ name: 'formstack-connector', version: '1.0.0' });
registerTools(server, api, cfg);

const transport = new StdioServerTransport();
await server.connect(transport);

const shutdown = async () => {
  try { await server.close(); } finally { process.exit(0); }
};
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
