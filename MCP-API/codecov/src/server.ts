import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { CodecovClient } from './client.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const api = new CodecovClient(config);
const server = new McpServer({ name: 'codecov-connector', version: '1.0.0' });
registerTools(server, api);
await server.connect(new StdioServerTransport());
