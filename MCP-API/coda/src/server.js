import readline from 'node:readline';
import { loadConfig } from './config.js';
import { CodaApiError, CodaClient } from './client.js';
import { assertAllowed } from './policy.js';
import { TOOLS, TOOL_MAP } from './tools.js';

const PROTOCOL_VERSION = '2025-11-25';

export function createRuntime(config, fetchImpl = globalThis.fetch) {
  const client = new CodaClient(config, fetchImpl);
  return async function handle(message) {
    if (!message || message.jsonrpc !== '2.0') throw new Error('Invalid JSON-RPC message.');
    const { id, method, params } = message;
    if (method === 'initialize') return reply(id, { protocolVersion: PROTOCOL_VERSION, capabilities: { tools: { listChanged: false } }, serverInfo: { name: 'coda-connector', version: '1.0.0' } });
    if (method === 'notifications/initialized' || method === 'notifications/cancelled') return null;
    if (method === 'ping') return reply(id, {});
    if (method === 'tools/list') return reply(id, { tools: TOOLS.map(t => ({ name:t.name, description:`${t.description} Risk=${t.risk}; permissions=${t.requiredPermissions.join(',')}; approval=${t.approvalRequired}.`, inputSchema:t.inputSchema, annotations:{ readOnlyHint:t.risk==='READ', destructiveHint:false, idempotentHint:t.risk==='READ', openWorldHint:true } })) });
    if (method === 'tools/call') {
      const tool = TOOL_MAP.get(params?.name);
      if (!tool) return failure(id, -32602, 'Tool is not exposed by this connector.');
      try {
        const args = tool.validate(params?.arguments ?? {});
        assertAllowed(tool, args, config);
        const result = await tool.handler(client, args);
        return reply(id, { content:[{type:'text',text:JSON.stringify(result,null,2)}], structuredContent: result });
      } catch (error) {
        return reply(id, { isError:true, content:[{type:'text',text:mapError(error)}] });
      }
    }
    return failure(id, -32601, 'Method not found.');
  };
}

function mapError(error) {
  if (!(error instanceof CodaApiError)) return error instanceof Error ? error.message : 'Unknown connector error.';
  if (error.status === 400) return `Coda rejected the request as invalid or stale: ${error.message}`;
  if (error.status === 401) return 'Coda authentication failed. Verify CODA_API_TOKEN.';
  if (error.status === 403) return 'Coda denied this operation. Verify token restrictions, doc access, and workspace role.';
  if (error.status === 404) return 'Coda resource was not found or is not visible to this token.';
  if (error.status === 410) return 'Coda reports that this resource has been deleted.';
  if (error.status === 429) return `Coda rate limit reached.${error.retryAfter ? ` Retry-After: ${error.retryAfter}.` : ''}`;
  return `Coda API error ${error.status}: ${error.message}`;
}
const reply = (id,result)=>({jsonrpc:'2.0',id,result});
const failure = (id,code,message)=>({jsonrpc:'2.0',id,error:{code,message}});

if (import.meta.url === `file://${process.argv[1]}`) {
  let config;
  try { config = loadConfig(); } catch (error) { console.error(error.message); process.exit(1); }
  const handle = createRuntime(config);
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on('line', async line => {
    if (!line.trim()) return;
    try {
      const response = await handle(JSON.parse(line));
      if (response) process.stdout.write(`${JSON.stringify(response)}\n`);
    } catch (error) {
      process.stdout.write(`${JSON.stringify(failure(null,-32700,error instanceof Error?error.message:'Parse error.'))}\n`);
    }
  });
}
