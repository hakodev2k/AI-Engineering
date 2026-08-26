import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './app.js';
import { loadConfig } from './config.js';

const server = createServer(loadConfig());
await server.connect(new StdioServerTransport());
