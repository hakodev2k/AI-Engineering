import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { OpsLevelClient } from './client.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const client = new OpsLevelClient(config);
const server = new McpServer({ name: 'opslevel-connector', version: '1.0.0' });
registerTools(server, client, config);
await server.connect(new StdioServerTransport());
