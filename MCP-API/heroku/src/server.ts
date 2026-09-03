import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { HerokuRestClient } from './rest.js';
import { HerokuMcpClient } from './upstream.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const rest = new HerokuRestClient(config);
const upstream = new HerokuMcpClient(config);
const server = new McpServer({ name: 'heroku-connector', version: '1.0.0' });
registerTools(server, config, rest, upstream);
await server.connect(new StdioServerTransport());

const shutdown = async () => {
  await upstream.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
