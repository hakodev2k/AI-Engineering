import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from '../auth/config.js';
import { IncidentIoUpstream } from '../client/upstream.js';
import { TOOL_MAP, toExternalDefinitions } from '../tools/catalog.js';
import { addApprovalSchema, authorize, splitApproval } from '../tools/policy.js';

const scrub = value => {
  if (Array.isArray(value)) return value.map(scrub);
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const [k, v] of Object.entries(value)) out[k] = /(token|secret|password|authorization|credential|api.?key)/i.test(k) ? '[REDACTED]' : scrub(v);
  return out;
};

export function createServer({ config = loadConfig(), upstream = new IncidentIoUpstream(config) } = {}) {
  const server = new Server({ name: 'incident-io-safe-connector', version: '1.0.0' }, { capabilities: { tools: {} } });
  let definitions;

  async function getDefinitions(signal) {
    if (!definitions) {
      const response = await upstream.listTools(signal);
      definitions = toExternalDefinitions(response.tools || []).map(addApprovalSchema);
    }
    return definitions;
  }

  server.setRequestHandler(ListToolsRequestSchema, async (_req, extra) => ({ tools: await getDefinitions(extra?.signal) }));
  server.setRequestHandler(CallToolRequestSchema, async (req, extra) => {
    try {
      const externalName = req.params.name;
      const upstreamName = TOOL_MAP[externalName];
      if (!upstreamName) throw new Error(`Unknown tool: ${externalName}`);
      await getDefinitions(extra?.signal);
      const { approvalToken, payload } = splitApproval(req.params.arguments || {});
      authorize(config, externalName, payload, approvalToken);
      const result = await upstream.callTool(upstreamName, payload, extra?.signal);
      const clean = scrub(result);
      return {
        content: [{ type: 'text', text: JSON.stringify({ untrusted_provider_data: true, data: clean }, null, 2) }],
        structuredContent: { untrusted_provider_data: true, data: clean }
      };
    } catch (error) {
      return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: error?.message || String(error), retryable: false }) }] };
    }
  });

  return { server, upstream };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { server, upstream } = createServer();
  const shutdown = async () => { await upstream.close().catch(() => {}); process.exit(0); };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  await server.connect(new StdioServerTransport());
}
