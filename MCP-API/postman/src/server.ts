import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { PostmanRestClient } from './rest.js';
import { PostmanMcpClient } from './upstream.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const rest = new PostmanRestClient(config);
const upstream = new PostmanMcpClient(config);
const server = new McpServer({ name: 'postman-connector', version: '1.0.0' });
registerTools(server, config, rest, upstream);

const transport = new StdioServerTransport();
await server.connect(transport);

const shutdown = async () => {
  await upstream.close().catch(() => undefined);
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
