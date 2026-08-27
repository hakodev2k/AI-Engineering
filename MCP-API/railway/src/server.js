import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { TOOL_MAP, authorize, getBlockedUpstreamTools } from "./policy.js";
import { RailwayUpstream } from "./upstream.js";
import { externalSchemaFromUpstream, validatorFor, validateOrThrow } from "./schema.js";

export async function createServer({ config = loadConfig(), upstream = null } = {}) {
  const railway = upstream || new RailwayUpstream(config);
  const server = new Server(
    { name: "railway-safe-connector", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  let registry = null;

  async function buildRegistry() {
    if (registry) return registry;
    const upstreamTools = await railway.listTools();
    const entries = new Map();

    for (const [externalName, policy] of Object.entries(TOOL_MAP)) {
      const tool = upstreamTools.get(policy.upstream);
      if (!tool) continue;

      const inputSchema = externalSchemaFromUpstream(tool.inputSchema, policy.approval);
      entries.set(externalName, {
        externalName,
        upstreamName: policy.upstream,
        risk: policy.risk,
        approval: policy.approval,
        description: `${tool.description || policy.upstream}. Risk: ${policy.risk}. ${policy.approval ? "Explicit connector approval required." : "No connector approval required."}`,
        inputSchema,
        validate: validatorFor(inputSchema)
      });
    }

    registry = entries;
    return registry;
  }

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const entries = await buildRegistry();
    return {
      tools: [...entries.values()].map((entry) => ({
        name: entry.externalName,
        description: entry.description,
        inputSchema: entry.inputSchema
      }))
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const entries = await buildRegistry();
      const entry = entries.get(request.params.name);
      if (!entry) throw new Error(`Unknown or unavailable Railway tool: ${request.params.name}`);

      const args = request.params.arguments || {};
      validateOrThrow(entry.validate, args);

      const { approval_token: approvalToken, ...payload } = args;
      authorize(config, entry.externalName, payload, approvalToken);

      if (getBlockedUpstreamTools().includes(entry.upstreamName)) {
        throw new Error(`Blocked upstream Railway tool: ${entry.upstreamName}`);
      }

      const result = await railway.callTool(entry.upstreamName, payload);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            untrusted_provider_data: true,
            upstream: "official-railway-mcp",
            data: result
          }, null, 2)
        }],
        structuredContent: {
          untrusted_provider_data: true,
          upstream: "official-railway-mcp",
          data: result
        }
      };
    } catch (error) {
      return {
        isError: true,
        content: [{
          type: "text",
          text: JSON.stringify({ error: normalizeError(error) })
        }]
      };
    }
  });

  return { server, upstream: railway };
}

function normalizeError(error) {
  const message = error?.message || String(error);
  const lower = message.toLowerCase();
  if (lower.includes("login") || lower.includes("auth") || lower.includes("unauthorized")) {
    return { type: "AUTHENTICATION", message, retryable: false };
  }
  if (lower.includes("timed out")) return { type: "TIMEOUT", message, retryable: true };
  if (lower.includes("rate") && lower.includes("limit")) return { type: "RATE_LIMIT", message, retryable: true };
  if (lower.includes("invalid tool input")) return { type: "VALIDATION", message, retryable: false };
  return { type: "UPSTREAM_MCP", message, retryable: false };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { server, upstream } = await createServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => {
    try { await upstream.close(); } finally { process.exit(0); }
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  await server.connect(transport);
}
