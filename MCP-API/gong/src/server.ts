import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { GongClient } from './client.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const client = new GongClient(config);
const server = new McpServer({ name: 'gong-connector', version: '1.0.0' });
registerTools(server, client, config);
await server.connect(new StdioServerTransport());
