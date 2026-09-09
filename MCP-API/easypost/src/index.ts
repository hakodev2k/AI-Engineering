import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { EasyPostClient } from './client.js';
import { loadConfig } from './config.js';
import { registerEasyPostTools } from './tools.js';

const config = loadConfig();
const server = new McpServer({ name: 'easypost-connector', version: '1.0.0' });
registerEasyPostTools(server, new EasyPostClient(config), config);
await server.connect(new StdioServerTransport());
