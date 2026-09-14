import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ToolRouter, tools } from "./tools.js";

const server = new Server({ name:"pipedream-connector", version:"1.0.0" }, { capabilities:{ tools:{} } });
const router = new ToolRouter();
server.setRequestHandler(ListToolsRequestSchema, async()=>({ tools:tools.map(({risk,...tool})=>tool) }));
server.setRequestHandler(CallToolRequestSchema, async request=>{
  try {
    const data = await router.execute(request.params.name, request.params.arguments || {});
    return { content:[{ type:"text", text:JSON.stringify({ok:true,data,untrustedProviderData:true}) }] };
  } catch(error:any) {
    return { isError:true, content:[{ type:"text", text:JSON.stringify({ok:false,error:{code:error?.code || error?.constructor?.name || "ERROR",message:error instanceof Error?error.message:"Unknown connector error",retryable:Boolean(error?.retryable)}}) }] };
  }
});
await server.connect(new StdioServerTransport());
