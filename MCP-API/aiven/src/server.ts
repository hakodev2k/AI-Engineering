import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { assertAllowed } from "./policy.js";
import { ROUTE_BY_EXTERNAL, TOOL_ROUTES } from "./tools.js";
import { createOfficialAivenClient, type UpstreamClient, withTimeout } from "./upstream.js";

function augmentSchema(schema: Record<string, unknown>, needsApproval: boolean): Record<string, unknown> {
  if (!needsApproval) return schema;
  const properties = { ...((schema.properties as Record<string, unknown> | undefined) ?? {}) };
  properties.approval = {
    type: "object",
    additionalProperties: false,
    properties: {
      confirmed: { type: "boolean", const: true },
      reason: { type: "string", minLength: 3, maxLength: 500 }
    },
    required: ["confirmed", "reason"]
  };
  const required = Array.from(new Set([ ...((schema.required as string[] | undefined) ?? []), "approval" ]));
  return { ...schema, type: "object", properties, required, additionalProperties: schema.additionalProperties ?? false };
}

export async function buildServer(upstream?: UpstreamClient) {
  const config = loadConfig();
  const client = upstream ?? await createOfficialAivenClient(config);
  const discovered = await withTimeout(client.listTools(), config.timeoutMs);
  const byName = new Map(discovered.tools.map((t) => [t.name, t]));

  const missing = TOOL_ROUTES.filter((r) => !byName.has(r.upstream));
  if (missing.length) {
    await client.close();
    throw new Error(`Official Aiven MCP is missing required tools: ${missing.map((m) => m.upstream).join(", ")}`);
  }

  const server = new Server({ name: "aiven-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_ROUTES.map((route) => {
      const source = byName.get(route.upstream)!;
      const approval = route.risk !== "READ";
      return {
        name: route.external,
        description: `${route.purpose} Risk=${route.risk}. Upstream=official Aiven MCP (${route.upstream}).${approval ? " Approval required by connector policy." : ""}`,
        inputSchema: augmentSchema(source.inputSchema, approval)
      };
    })
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const route = ROUTE_BY_EXTERNAL.get(request.params.name);
    if (!route) throw new Error("Unknown or unapproved Aiven tool.");

    const args = { ...(request.params.arguments ?? {}) } as Record<string, unknown>;
    const approval = args.approval as { confirmed?: boolean; reason?: string } | undefined;
    delete args.approval;
    assertAllowed(route.risk, approval, config);

    try {
      return await withTimeout(client.callTool({ name: route.upstream, arguments: args }), config.timeoutMs) as never;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown upstream error";
      if (/401|unauthoriz|token/i.test(message)) throw new Error("Aiven authentication failed. Check AIVEN_TOKEN and its permissions.");
      if (/403|forbidden|permission/i.test(message)) throw new Error("Aiven denied this operation. Verify least-privilege project/service permissions.");
      if (/429|rate.?limit|thrott/i.test(message)) throw new Error("Aiven rate limit reached. Retry after the provider's retry window; the connector does not blindly replay write calls.");
      throw error;
    }
  });

  return { server, close: () => client.close() };
}

async function main() {
  const { server, close } = await buildServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => { await close(); process.exit(0); };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
