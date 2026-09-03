import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { GorgiasClient } from './client.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const client = new GorgiasClient(config);
const server = new McpServer({ name: 'gorgias-connector', version: '1.0.0' });
registerTools(server, config, client);
await server.connect(new StdioServerTransport());
