import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ZodError } from 'zod';
import { loadConfig } from './config.js';
import { assertAllowed } from './policy.js';
import { TOOL_MAP, TOOLS } from './tools.js';
import { AttioUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new AttioUpstream(config);
export const server = new McpServer({ name:'attio-mcp-connector', version:'1.0.0' });

function output(value: unknown) {
  return { content:[{ type:'text' as const, text:JSON.stringify({ source:'attio', untrustedData:true, result:value }, null, 2) }] };
}

for (const tool of TOOLS) {
  server.tool(tool.name, `${tool.description} Risk=${tool.risk}; upstream=official Attio MCP.`, tool.schema.shape, async raw => {
    try {
      const args = tool.schema.parse(raw) as Record<string, unknown>;
      assertAllowed(tool.risk, tool.name, args, config);
      const clean = { ...args };
      delete clean.approvalId;
      return output(await upstream.call(tool.upstream, clean, tool.risk));
    } catch (error) {
      if (error instanceof ZodError) throw new Error(`Invalid input for ${tool.name}: ${error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
      const message = error instanceof Error ? error.message : String(error);
      if (/401|unauthori|invalid.?token/i.test(message)) throw new Error('Attio authentication failed or the OAuth session expired. Re-authorize the connector; credentials must stay outside prompts.');
      if (/403|forbidden|permission/i.test(message)) throw new Error('Attio denied this operation. Verify the authenticated user permissions; do not broaden permissions automatically.');
      if (/429|rate.?limit/i.test(message)) throw new Error('Attio rate limit reached. Reduce call concurrency and retry after the provider window resets.');
      throw error;
    }
  });
}

export function registeredToolNames(): string[] { return [...TOOL_MAP.keys()].sort(); }

const shutdown = async () => {
  try { await upstream.close(); await server.close(); process.exit(0); }
  catch { process.exit(1); }
};
process.once('SIGINT', () => { void shutdown(); });
process.once('SIGTERM', () => { void shutdown(); });

if (import.meta.url === `file://${process.argv[1]}`) await server.connect(new StdioServerTransport());
