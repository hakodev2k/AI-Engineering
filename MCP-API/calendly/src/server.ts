import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { invoke, tools } from "./tools.js";

const server = new McpServer({ name: "calendly-connector", version: "1.0.0" });
for (const tool of tools) {
  server.registerTool(tool.name, { description: `${tool.description} Risk: ${tool.risk}.`, inputSchema: (tool.schema as z.ZodObject<any>).shape }, async (args) => {
    try { const result = await invoke(tool.name, args); return { content:[{type:"text",text:JSON.stringify({ data:result, untrusted_provider_content:true })}] }; }
    catch (e:any) { return { isError:true, content:[{type:"text",text:JSON.stringify({ error:e?.message || "UNKNOWN_ERROR" })}] }; }
  });
}
await server.connect(new StdioServerTransport());
