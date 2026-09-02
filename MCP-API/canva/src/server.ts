import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { CanvaCredentialProvider } from './auth.js';
import { CanvaRestClient } from './rest.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const credentials = new CanvaCredentialProvider(config);
const api = new CanvaRestClient(config, credentials);
const server = new McpServer({ name: 'canva-connector', version: '1.0.0' });
registerTools(server, config, api);

await server.connect(new StdioServerTransport());

const shutdown = async () => process.exit(0);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
