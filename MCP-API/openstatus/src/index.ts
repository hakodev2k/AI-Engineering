import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { createServer } from './server.js';

const config = loadConfig();
const { server, upstream } = createServer(config);

async function shutdown(): Promise<void> {
  await upstream.close();
  await server.close();
}

process.once('SIGINT', () => { void shutdown().finally(() => process.exit(0)); });
process.once('SIGTERM', () => { void shutdown().finally(() => process.exit(0)); });

await server.connect(new StdioServerTransport());
