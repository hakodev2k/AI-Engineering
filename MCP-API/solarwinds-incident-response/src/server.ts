import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { SolarWindsIncidentResponseClient } from './client.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const api = new SolarWindsIncidentResponseClient(config);
const server = new McpServer({ name: 'solarwinds-incident-response-connector', version: '1.0.0' });

registerTools(server, api, config);
await server.connect(new StdioServerTransport());

const shutdown = async () => process.exit(0);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
