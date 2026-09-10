import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ImgixClient } from "./client.js";
import { tools } from "./tools.js";

export function createServer(client = new ImgixClient()): McpServer {
  const server = new McpServer({ name: "imgix-connector", version: "1.0.0" });
  for (const [name, def] of Object.entries(tools)) {
    const shape = (def.schema as any).shape;
    server.tool(name, def.description, shape, async (input: unknown) => {
      try {
        const parsed = def.schema.parse(input);
        const data = await def.run(parsed, client);
        return { content: [{ type: "text" as const, text: JSON.stringify({ data, meta: { provider: "imgix", untrustedProviderContent: true } }) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown connector error";
        return { isError: true, content: [{ type: "text" as const, text: JSON.stringify({ error: message }) }] };
      }
    });
  }
  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
}
