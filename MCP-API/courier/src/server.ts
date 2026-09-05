import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { assertAllowed } from "./policy.js";
import { classifyProviderError, callWithReadRetry, withTimeout } from "./reliability.js";
import { ROUTE_BY_EXTERNAL, TOOL_ROUTES } from "./tools.js";
import { createOfficialCourierClient, type UpstreamClient } from "./upstream.js";

function approvalSchema(schema: Record<string, unknown>, requiredApproval: boolean): Record<string, unknown> {
  if (!requiredApproval) return schema;
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
  return { ...schema, type: "object", properties, required, additionalProperties: false };
}

export async function buildServer(upstream?: UpstreamClient) {
  const config = loadConfig();
  const client = upstream ?? await createOfficialCourierClient(config);
  const discovered = await withTimeout(client.listTools(), config.timeoutMs);
  const byName = new Map(discovered.tools.map((tool) => [tool.name, tool]));
  const missing = TOOL_ROUTES.filter((route) => !byName.has(route.upstream));
  if (missing.length) {
    await client.close();
    throw new Error(`Official Courier MCP is missing required tools: ${missing.map((item) => item.upstream).join(", ")}`);
  }

  const server = new Server({ name: "courier-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_ROUTES.map((route) => {
      const source = byName.get(route.upstream)!;
      return {
        name: route.external,
        description: `${route.purpose} Risk=${route.risk}. Transport=official Courier remote MCP (${route.upstream}).`,
        inputSchema: approvalSchema(source.inputSchema, route.risk !== "READ")
      };
    })
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const route = ROUTE_BY_EXTERNAL.get(request.params.name);
    if (!route) throw new Error("Unknown or unapproved Courier tool.");
    const args = { ...(request.params.arguments ?? {}) } as Record<string, unknown>;
    const approval = args.approval as { confirmed?: boolean; reason?: string } | undefined;
    delete args.approval;
    assertAllowed(route.risk, approval, config);

    const call = () => withTimeout(client.callTool({ name: route.upstream, arguments: args }), config.timeoutMs);
    try {
      return route.risk === "READ"
        ? await callWithReadRetry(call, config.readRetries) as never
        : await call() as never;
    } catch (error) {
      throw classifyProviderError(error);
    }
  });

  return { server, close: () => client.close() };
}

async function main() {
  const { server, close } = await buildServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => {
    await close();
    process.exit(0);
  };
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
