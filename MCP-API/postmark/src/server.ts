import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { authFromEnv } from './auth.js';
import { PostmarkClient } from './client.js';
import { createTools } from './tools.js';

export function buildServer(env: NodeJS.ProcessEnv = process.env): McpServer {
  const client = new PostmarkClient(authFromEnv(env), {
    baseUrl: env.POSTMARK_API_BASE_URL,
    timeoutMs: env.POSTMARK_TIMEOUT_MS ? Number(env.POSTMARK_TIMEOUT_MS) : undefined,
    maxRetries: env.POSTMARK_MAX_RETRIES ? Number(env.POSTMARK_MAX_RETRIES) : undefined
  });
  const server = new McpServer({ name: 'postmark-connector', version: '1.0.0' });
  const requireWrite = env.POSTMARK_REQUIRE_WRITE_APPROVAL !== 'false';
  for (const t of createTools(client, requireWrite)) {
    server.tool(t.name, t.description, (t.schema as any).shape, async (args: unknown, extra: any) => {
      try { const result = await t.run(args, extra?.signal); return { content: [{ type: 'text', text: JSON.stringify(result) }] }; }
      catch (error) { return { isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : 'Unknown connector error' }] }; }
    });
  }
  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const server = buildServer();
  await server.connect(new StdioServerTransport());
}
