import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "../auth/config.js";
import { UpstashRedisClient, UpstashRedisError } from "../client/redis-rest.js";
import { TOOL_DEFINITIONS, payloadWithoutApproval } from "../tools/definitions.js";
import { authorize } from "../tools/policy.js";

export function createServer({ config = loadConfig(), client = null } = {}) {
  const api = client || new UpstashRedisClient(config);
  const server = new Server({ name: "upstash-safe-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFINITIONS }));
  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    const name = request.params.name;
    const args = request.params.arguments || {};
    const payload = payloadWithoutApproval(args);
    try {
      authorize(config, name, payload, args.approval_token);
      const signal = extra?.signal;
      let result;
      switch (name) {
        case "upstash.system.ping": result = await api.ping(signal); break;
        case "upstash.key.get": result = await api.get(args.key, signal); break;
        case "upstash.key.mget": result = await api.mget(args.keys, signal); break;
        case "upstash.key.exists": result = await api.exists(args.keys, signal); break;
        case "upstash.key.ttl": result = await api.ttl(args.key, signal); break;
        case "upstash.key.type": result = await api.type(args.key, signal); break;
        case "upstash.key.scan": result = await api.scan({ cursor: args.cursor ?? "0", match: args.match, count: args.count ?? 100 }, signal); break;
        case "upstash.hash.get_all": result = await api.hgetall(args.key, signal); break;
        case "upstash.list.range": result = await api.lrange(args.key, args.start, args.stop, signal); break;
        case "upstash.sorted_set.range": result = await api.zrange(payload, signal); break;
        case "upstash.key.set": result = await api.set(payload, signal); break;
        case "upstash.hash.set": result = await api.hset(args.key, args.fields, signal); break;
        case "upstash.counter.increment": result = await api.increment(args.key, args.amount ?? 1, signal); break;
        case "upstash.key.expire": result = await api.expire(args.key, args.seconds, signal); break;
        case "upstash.key.delete": result = await api.delete(args.keys, signal); break;
        default: throw new Error(`Unknown tool: ${name}`);
      }
      return { content: [{ type: "text", text: JSON.stringify({ untrusted_provider_data: true, data: result }, null, 2) }], structuredContent: { untrusted_provider_data: true, data: result } };
    } catch (error) {
      return { isError: true, content: [{ type: "text", text: JSON.stringify({ error: normalizeError(error) }) }] };
    }
  });
  return server;
}

function normalizeError(error) {
  if (error instanceof UpstashRedisError) {
    if (error.status === 401 || error.status === 403) return { type: "AUTHORIZATION", status: error.status, message: error.message, retryable: false };
    if (error.status === 429) return { type: "RATE_LIMIT", status: 429, message: error.message, retryAfter: error.retryAfter, retryable: true };
    return { type: error.status && error.status >= 500 ? "PROVIDER_UNAVAILABLE" : "PROVIDER_REQUEST", status: error.status, message: error.message, retryAfter: error.retryAfter, retryable: Boolean(error.status && error.status >= 500) };
  }
  return { type: "CONNECTOR", message: error?.message || String(error), retryable: false };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}
