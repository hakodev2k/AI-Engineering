import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "./zod-json.js";
import { loadConfig } from "./config.js";
import { ClerkApiError, ClerkClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOL_BY_NAME, TOOLS } from "./tools.js";

export function buildServer(env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch) {
  const cfg = loadConfig(env);
  const client = new ClerkClient(cfg, fetchImpl);
  const server = new Server({ name: "clerk-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map(tool => ({
      name: tool.name,
      description: `${tool.description} Risk=${tool.risk}. Transport=Clerk Backend REST API.${tool.approvalRequired ? " Approval required." : ""}`,
      inputSchema: zodToJsonSchema(tool.schema)
    }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const tool = TOOL_BY_NAME.get(request.params.name);
    if (!tool) throw new Error("Unknown Clerk tool.");
    const parsed = tool.schema.parse(request.params.arguments ?? {});
    const approval = (parsed as any).approval;
    assertAllowed(tool.risk, approval, cfg);
    try {
      const result = await tool.invoke(parsed, client);
      return { content: [{ type: "text", text: JSON.stringify({ untrusted_provider_data: true, result }) }] };
    } catch (error) {
      if (error instanceof ClerkApiError) {
        if (error.status === 401) throw new Error("Clerk authentication failed. Check CLERK_SECRET_KEY.");
        if (error.status === 403) throw new Error("Clerk denied the operation. Verify instance permissions and endpoint availability.");
        if (error.status === 404) throw new Error("The requested Clerk resource was not found.");
        if (error.status === 422) throw new Error(`Clerk rejected the request: ${error.message}`);
        if (error.status === 429) throw new Error(`Clerk rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}s.` : ""}`);
      }
      throw error;
    }
  });

  return server;
}

async function main() {
  const server = buildServer();
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
