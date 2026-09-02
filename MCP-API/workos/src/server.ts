import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { WorkOSClient } from './client.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const api = new WorkOSClient(config);
const server = new McpServer({ name: 'workos-connector', version: '1.0.0' });
registerTools(server, config, api);
await server.connect(new StdioServerTransport());
