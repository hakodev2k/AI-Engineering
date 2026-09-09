import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { Config } from './config.js';
import { authorize } from './policy.js';
import { resolveTools, stripLocalApproval, type ResolvedTool } from './tools.js';
import type { UpstreamCaller } from './upstream.js';

const MAX_RESULT_CHARS = 1_000_000;

function safeError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  return raw.replace(/Api-Key\s+\S+/gi, 'Api-Key [REDACTED]').slice(0, 4000);
}

function resultContent(value: unknown) {
  const text = JSON.stringify({ provider: 'flagsmith', transport: 'official_mcp', untrusted_data: true, result: value });
  if (text.length > MAX_RESULT_CHARS) throw new Error('Flagsmith response exceeded the connector output safety limit');
  return [{ type: 'text' as const, text }];
}

export async function createServer(cfg: Config, upstream: UpstreamCaller): Promise<Server> {
  const resolved = resolveTools(await upstream.listTools());
  const routes = new Map<string, ResolvedTool>(resolved.map(tool => [tool.external, tool]));
  const server = new Server(
    { name: 'flagsmith-safe-connector', version: '1.0.0' },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: resolved.map(tool => ({
      name: tool.external,
      description: `${tool.purpose} Permission=${tool.risk}. ${tool.risk === 'READ' ? 'No approval required.' : tool.risk === 'HIGH_RISK' ? 'Explicit human approval is always required.' : 'Human approval follows FLAGSMITH_REQUIRE_WRITE_APPROVAL.'}`,
      inputSchema: tool.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    const route = routes.get(request.params.name);
    if (!route) return { isError: true, content: [{ type: 'text', text: 'Unknown or disallowed Flagsmith tool' }] };
    try {
      const args = (request.params.arguments ?? {}) as Record<string, unknown>;
      const { approved, upstreamArgs } = stripLocalApproval(args);
      authorize(route.risk, approved, cfg);
      const result = await upstream.call(route.upstream, upstreamArgs, route.risk, extra.signal);
      return { content: resultContent(result) };
    } catch (error) {
      return { isError: true, content: [{ type: 'text', text: safeError(error) }] };
    }
  });

  return server;
}
