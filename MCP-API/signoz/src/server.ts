import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { SigNozMcpClient } from './upstream.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const upstream = new SigNozMcpClient(config);
const server = new McpServer({ name: 'signoz-connector', version: '1.0.0' });
registerTools(server, upstream, config);
await server.connect(new StdioServerTransport());

const shutdown = async () => {
  await upstream.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
