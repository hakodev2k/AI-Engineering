import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { OctopusRestClient } from './rest.js';
import { OctopusMcpClient } from './upstream.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const api = new OctopusRestClient(config);
const upstream = new OctopusMcpClient(config);
const server = new McpServer({ name: 'octopus-deploy-connector', version: '1.0.0' });
registerTools(server, config, api, upstream);
await server.connect(new StdioServerTransport());

async function shutdown(): Promise<void> {
  await upstream.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
