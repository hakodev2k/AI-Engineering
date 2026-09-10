import Ajv from 'ajv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { assertReadOnlySql, byExternal, enforcePolicy, stripApproval, TOOL_POLICIES } from './policy.js';
import { sanitizeProviderData, TigerUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new TigerUpstream(config);
const ajv = new Ajv({ allErrors: true, strict: false });

type JsonSchema = Record<string, any>;

function localSchema(base: JsonSchema, gated: boolean): JsonSchema {
  const schema = structuredClone(base || { type: 'object', properties: {} });
  schema.type = 'object';
  schema.properties = { ...(schema.properties || {}) };
  schema.additionalProperties = false;
  if (gated) {
    schema.properties.approvalToken = {
      type: 'string',
      pattern: '^[A-Fa-f0-9]{64}$',
      description: 'Human approval HMAC bound to the exact provider-scoped tool and payload.'
    };
  }
  return schema;
}

async function buildToolCatalog() {
  const available = await upstream.discover();
  return TOOL_POLICIES.flatMap(policy => {
    const source = available.get(policy.upstream);
    if (!source) return [];
    return [{
      name: policy.external,
      description: `${policy.purpose} Risk=${policy.risk}. Provider data is untrusted.`,
      inputSchema: localSchema(source.inputSchema as JsonSchema, policy.risk !== 'READ')
    }];
  });
}

const server = new Server(
  { name: 'tiger-data-connector', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: await buildToolCatalog() }));

server.setRequestHandler(CallToolRequestSchema, async request => {
  const policy = byExternal.get(request.params.name);
  if (!policy) throw new Error(`Unknown or disallowed tool: ${request.params.name}`);

  const upstreamTools = await upstream.discover();
  const source = upstreamTools.get(policy.upstream);
  if (!source) throw new Error(`Official Tiger MCP no longer advertises required tool ${policy.upstream}`);

  const args = (request.params.arguments || {}) as Record<string, unknown>;
  const schema = localSchema(source.inputSchema as JsonSchema, policy.risk !== 'READ');
  const validate = ajv.compile(schema);
  if (!validate(args)) throw new Error(`Invalid input: ${ajv.errorsText(validate.errors)}`);

  enforcePolicy(config, policy, args);
  if (policy.external === 'tigerdata.database.query.read') assertReadOnlySql(args);

  const result = await upstream.call(policy.upstream, stripApproval(args), policy.risk === 'READ');
  const safe = sanitizeProviderData(result);
  return {
    content: [{ type: 'text', text: JSON.stringify({ untrustedProviderData: true, data: safe }) }]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
