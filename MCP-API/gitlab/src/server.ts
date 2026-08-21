import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { loadConfig } from './config.js';
import { GitLabRestClient } from './gitlab-rest.js';
import { GitLabMcpClient } from './gitlab-mcp.js';
import { registerTools } from './tools.js';

export function createServer(env: NodeJS.ProcessEnv = process.env) {
  const cfg = loadConfig(env);
  const server = new McpServer({ name: 'gitlab-connector', version: '1.0.0' });
  const rest = new GitLabRestClient(cfg);
  const upstream = new GitLabMcpClient(cfg);
  registerTools(server, { cfg, rest, upstream });
  return { server, upstream };
}

async function main() {
  const { server, upstream } = createServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => {
    await upstream.close().catch(() => undefined);
    await server.close().catch(() => undefined);
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`GitLab connector failed: ${message}`);
    process.exit(1);
  });
}
