import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { RootlyRestClient } from './rest.js';
import { RootlyMcpClient } from './upstream.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const api = new RootlyRestClient(config);
const upstream = new RootlyMcpClient(config);
const server = new McpServer({ name: 'rootly-connector', version: '1.0.0' });
registerTools(server, api, upstream);
await server.connect(new StdioServerTransport());

const shutdown = async () => {
  await upstream.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
