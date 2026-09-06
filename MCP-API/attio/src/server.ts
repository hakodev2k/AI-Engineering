import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ZodError } from 'zod';
import { loadConfig } from './config.js';
import { assertAllowed, requiredPermission } from './policy.js';
import { TOOL_MAP, TOOLS } from './tools.js';
import { AttioUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new AttioUpstream(config);
export const server = new McpServer({ name:'attio-mcp-connector', version:'1.0.0' });

function output(value: unknown) {
  return { content:[{ type:'text' as const, text:JSON.stringify({ source:'attio', untrustedData:true, result:value }, null, 2) }] };
}

function assertPaired(args: Record<string, unknown>, a: string, b: string): void {
  if ((args[a] === undefined) !== (args[b] === undefined)) throw new Error(`${a} and ${b} must be provided together.`);
}

function validateRelationships(name: string, args: Record<string, unknown>): void {
  if (name === 'attio.note.search') assertPaired(args, 'parent_record_object', 'parent_record_id');
  if (name === 'attio.task.list' || name === 'attio.task.create' || name === 'attio.task.update') assertPaired(args, 'linked_record_object', 'linked_record_id');
  if (name === 'attio.meeting.search') assertPaired(args, 'related_record_object', 'related_record_ids');
  if (name === 'attio.task.update') {
    const mutable = ['deadline_at','assignee_workspace_member_id','is_completed','linked_record_object','linked_record_id'];
    if (!mutable.some(k => args[k] !== undefined)) throw new Error('attio.task.update requires at least one update field.');
  }
}

for (const tool of TOOLS) {
  const permission = requiredPermission(tool.risk).toUpperCase();
  const approval = tool.risk === 'READ' ? 'not required' : tool.risk === 'WRITE' ? 'required by default' : 'always required';
  const description = `${tool.description} RequiredPermission=${permission}; Risk=${tool.risk}; Approval=${approval}; Output=JSON text wrapped as untrusted provider data; Errors=validation/auth/permission/rate-limit/timeout/provider; Upstream=official Attio MCP.`;
  server.tool(tool.name, description, tool.schema.shape, async raw => {
    try {
      const args = tool.schema.parse(raw) as Record<string, unknown>;
      validateRelationships(tool.name, args);
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
