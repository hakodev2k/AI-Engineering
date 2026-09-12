import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { SauceRestClient } from './rest.js';
import { SauceMcpClient } from './upstream.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const rest = new SauceRestClient(config);
const upstream = new SauceMcpClient(config);
const server = new McpServer({ name: 'saucelabs-connector', version: '1.0.0' });

registerTools(server, config, rest, upstream);
await server.connect(new StdioServerTransport());

const shutdown = async (): Promise<void> => {
  await upstream.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
