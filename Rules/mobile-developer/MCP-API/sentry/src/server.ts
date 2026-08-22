import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { loadConfig } from './config.js';
import { SentryClient } from './client.js';
import { registerTools } from './tools.js';

export function createServer(env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch) {
  const cfg = loadConfig(env);
  const server = new McpServer({ name: 'sentry-connector', version: '1.0.0' });
  const client = new SentryClient(cfg, fetchImpl);
  registerTools(server, { cfg, client });
  return { server, cfg, client };
}

async function main() {
  const { server } = createServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => {
    await server.close().catch(() => undefined);
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`Sentry connector failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
