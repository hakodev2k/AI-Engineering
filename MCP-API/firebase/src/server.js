import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { TOOL_MAP, authorize, withoutApproval } from "./policy.js";
import { FirebaseUpstream } from "./upstream.js";

const APPROVAL_SCHEMA = {
  type: "string",
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$"
};

export async function createServer({ config = loadConfig(), upstream = null } = {}) {
  const firebase = upstream || new FirebaseUpstream(config);
  const officialTools = await firebase.listAllowedTools();

  const externalTools = Object.entries(TOOL_MAP).map(([name, policy]) => {
    const source = officialTools.get(policy.upstream);
    const baseSchema = source.inputSchema && source.inputSchema.type === "object"
      ? structuredClone(source.inputSchema)
      : { type: "object", properties: {}, additionalProperties: false };
    baseSchema.properties = { ...(baseSchema.properties || {}) };
    if (policy.approval) {
      baseSchema.properties.approval_token = APPROVAL_SCHEMA;
      baseSchema.required = [...new Set([...(baseSchema.required || []), "approval_token"])];
    }
    return {
      name,
      description: `${source.description || policy.upstream} Risk: ${policy.risk}. Approval: ${policy.approval ? "required" : "not required"}. Upstream: official Firebase MCP.`,
      inputSchema: baseSchema
    };
  });

  const server = new Server(
    { name: "firebase-guarded-connector", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: externalTools }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name;
    const args = request.params.arguments || {};
    const payload = withoutApproval(args);
    try {
      authorize(config, name, payload, args.approval_token);
      const policy = TOOL_MAP[name];
      if (!policy) throw new Error(`Unknown tool: ${name}`);
      const result = await firebase.call(policy.upstream, payload);
      return {
        content: [{ type: "text", text: JSON.stringify({ untrusted_provider_data: true, upstream: "official-firebase-mcp", data: result }, null, 2) }],
        structuredContent: { untrusted_provider_data: true, upstream: "official-firebase-mcp", data: result }
      };
    } catch (error) {
      return { isError: true, content: [{ type: "text", text: JSON.stringify({ error: normalizeError(error) }) }] };
    }
  });

  return { server, firebase, externalTools };
}

function normalizeError(error) {
  const message = error?.message || String(error);
  const lower = message.toLowerCase();
  if (lower.includes("auth") || lower.includes("login") || lower.includes("permission")) return { type: "AUTHORIZATION", message, retryable: false };
  if (lower.includes("rate") || lower.includes("429") || lower.includes("quota")) return { type: "RATE_LIMIT", message, retryable: true };
  if (lower.includes("timeout") || lower.includes("temporar") || lower.includes("unavailable")) return { type: "UPSTREAM_TRANSIENT", message, retryable: true };
  return { type: "CONNECTOR", message, retryable: false };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { server, firebase } = await createServer();
  const shutdown = async () => {
    await firebase.close().catch(() => {});
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  await server.connect(new StdioServerTransport());
}
