import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { BackblazeClient, BackblazeApiError } from "./client.js";
import { loadConfig } from "./config.js";
import { PolicyError } from "./policy.js";
import { TOOL_SPECS } from "./tools.js";

export function buildServer() {
  const config = loadConfig();
  const client = new BackblazeClient(config);
  const server = new McpServer({ name: "backblaze-b2-connector", version: "1.0.0" });

  for (const spec of TOOL_SPECS) {
    const schema = spec.schema as z.ZodObject<any>;
    server.registerTool(
      spec.name,
      {
        title: spec.name,
        description: `${spec.description} Risk=${spec.risk}; permission=${spec.permission}; approval=${spec.approval}.`,
        inputSchema: schema.shape,
        annotations: {
          readOnlyHint: spec.risk === "READ",
          destructiveHint: spec.risk === "DESTRUCTIVE"
        }
      },
      async (rawInput: unknown) => {
        try {
          const input = spec.schema.parse(rawInput);
          const data = await spec.run(client, config, input);
          return {
            content: [{ type: "text", text: JSON.stringify({ data, providerContentUntrusted: true }) }]
          };
        } catch (error: any) {
          const known = error instanceof z.ZodError || error instanceof PolicyError || error instanceof BackblazeApiError;
          return {
            isError: true,
            content: [{
              type: "text",
              text: JSON.stringify({
                error: known ? error.name : "ConnectorError",
                message: known ? error.message : "Backblaze connector operation failed",
                status: error instanceof BackblazeApiError ? error.status : undefined,
                code: error instanceof BackblazeApiError ? error.code : undefined,
                retryAfterSeconds: error instanceof BackblazeApiError ? error.retryAfterSeconds : undefined
              })
            }]
          };
        }
      }
    );
  }

  return server;
}

async function main() {
  const server = buildServer();
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error("Backblaze MCP server failed to start:", error instanceof Error ? error.message : "unknown error");
    process.exitCode = 1;
  });
}
