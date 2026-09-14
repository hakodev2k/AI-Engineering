import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ToolRouter, tools } from "./tools.js";

const server = new Server({ name: "cloudconvert-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
const router = new ToolRouter();
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: tools.map(({ risk, ...t }) => t) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  try {
    const data = await router.execute(request.params.name, request.params.arguments || {});
    return { content: [{ type: "text", text: JSON.stringify({ ok:true, data, untrustedProviderData:true }) }] };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown connector error";
    return { isError:true, content:[{ type:"text", text:JSON.stringify({ ok:false, error:{ name:error?.constructor?.name || "Error", message } }) }] };
  }
});
await server.connect(new StdioServerTransport());
