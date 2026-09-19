import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig, requirePermission } from "./config.js";
import { TravisClient } from "./client.js";
import { toolDefinitions } from "./tools.js";

export function createServer(env: NodeJS.ProcessEnv = process.env, fetchFn: typeof fetch = fetch) {
  const config = loadConfig(env);
  const client = new TravisClient(config, fetchFn);
  const server = new McpServer({ name:"travis-ci-connector", version:"1.0.0" });
  for (const tool of toolDefinitions(client, config)) {
    server.tool(tool.name, tool.description, tool.schema.shape, async (raw) => {
      try {
        const input = tool.schema.parse(raw);
        if (tool.risk === "READ") requirePermission(config, "READ");
        const data = await tool.run(input as never);
        return { content:[{type:"text" as const,text:JSON.stringify({ok:true,data,security:{providerContentIsUntrusted:true}},null,2)}] };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown connector error";
        return { isError:true, content:[{type:"text" as const,text:JSON.stringify({ok:false,error:message})}] };
      }
    });
  }
  return server;
}

if (process.env.NODE_ENV !== "test") {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}
