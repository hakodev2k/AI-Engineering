import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { authorize, BY_EXTERNAL, BY_UPSTREAM } from "./policy.js";
import { WrikeUpstream } from "./upstream.js";

export type UpstreamLike = Pick<WrikeUpstream, "listTools" | "callTool">;

function withApprovalSchema(schema: unknown, needsApproval: boolean): Record<string, unknown> {
  const base = schema && typeof schema === "object" ? structuredClone(schema as Record<string, unknown>) : { type: "object" };
  if (!needsApproval) return base;
  const properties = base.properties && typeof base.properties === "object"
    ? { ...(base.properties as Record<string, unknown>) }
    : {};
  properties.approvalToken = {
    type: "string",
    minLength: 1,
    description: "Host-injected token proving explicit human approval. Never place this token in model context."
  };
  base.properties = properties;
  const required = Array.isArray(base.required) ? [...base.required] : [];
  if (!required.includes("approvalToken")) required.push("approvalToken");
  base.required = required;
  return base;
}

export function createServer(upstream: UpstreamLike, config = loadConfig()): Server {
  const server = new Server({ name: "wrike-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const discovered = await upstream.listTools();
    const tools = discovered.tools.flatMap(tool => {
      const policy = BY_UPSTREAM.get(tool.name);
      if (!policy) return [];
      return [{
        name: policy.external,
        description: `${tool.description ?? policy.external} Permission=${policy.risk}. ${policy.risk === "WRITE" ? "Explicit human approval required." : "Read-only."}`,
        inputSchema: withApprovalSchema(tool.inputSchema, policy.risk === "WRITE") as any
      }];
    });
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const policy = BY_EXTERNAL.get(request.params.name);
    if (!policy) throw new Error("Tool is not exposed by this connector.");
    const raw = request.params.arguments;
    if (raw !== undefined && (raw === null || Array.isArray(raw) || typeof raw !== "object")) {
      throw new Error("Tool input must be a JSON object.");
    }
    const args = authorize(policy, (raw ?? {}) as Record<string, unknown>, config);
    try {
      return await upstream.callTool(policy.upstream, args) as any;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/401|unauthorized|authentication/i.test(message)) throw new Error("Wrike authentication failed. Renew the connector credential.");
      if (/403|forbidden|permission/i.test(message)) throw new Error("Wrike denied the operation under the authenticated user's permissions.");
      if (/429|rate.?limit|thrott/i.test(message)) throw new Error("Wrike rate limit reached. Retry later with bounded backoff at the caller.");
      if (/abort|timeout/i.test(message)) throw new Error("Wrike MCP request timed out.");
      throw new Error(`Wrike MCP error: ${message}`);
    }
  });

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = loadConfig();
  const server = createServer(new WrikeUpstream(config), config);
  server.connect(new StdioServerTransport()).catch(error => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
