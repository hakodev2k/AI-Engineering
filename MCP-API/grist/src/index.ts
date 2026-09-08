#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './auth.js';
import { OfficialGristMcpClient } from './upstream.js';
import { createServer } from './server.js';

const config = loadConfig();
const upstream = new OfficialGristMcpClient(config);
const server = createServer(config, upstream);

const shutdown = async () => {
  await upstream.close().catch(() => undefined);
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await server.connect(new StdioServerTransport());
