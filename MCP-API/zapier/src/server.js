import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { ZapierUpstream } from './upstream.js';
import { classify, authorize } from './policy.js';

export async function buildServer(config = loadConfig(), upstream = new ZapierUpstream(config)) {
  const server = new McpServer({ name: 'zapier-safe-connector', version: '1.0.0' });
  const tools = await upstream.listTools();
  for (const tool of tools) {
    const risk = classify(tool);
    server.tool(`zapier.${tool.name}`, `${tool.description ?? tool.name} [risk=${risk}]`, {
      arguments: z.record(z.unknown()).default({}),
      approval_token: z.string().optional()
    }, async ({ arguments: args, approval_token }) => {
      authorize({ secret: config.approvalSecret, toolName: tool.name, args, suppliedToken: approval_token, risk });
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeoutMs);
      try {
        const result = await upstream.callTool(tool.name, args, controller.signal);
        return { content: [{ type: 'text', text: JSON.stringify({ source: 'untrusted_provider_data', risk, result }) }] };
      } catch (e) {
        return { isError: true, content: [{ type: 'text', text: e instanceof Error ? e.message : 'Zapier upstream failure' }] };
      } finally { clearTimeout(timer); }
    });
  }
  return { server, upstream, tools };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const { server } = await buildServer();
  await server.connect(new StdioServerTransport());
}
