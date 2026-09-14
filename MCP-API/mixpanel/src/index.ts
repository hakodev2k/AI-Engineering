import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema,ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ToolRouter,tools } from "./tools.js";

const server=new Server({name:"mixpanel-connector",version:"1.0.0"},{capabilities:{tools:{}}});
const router=new ToolRouter();
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools}));
server.setRequestHandler(CallToolRequestSchema,async(req)=>{
  try{return {content:[{type:"text",text:JSON.stringify({ok:true,...await router.execute(req.params.name,req.params.arguments||{})})}]};}
  catch(error:any){return {isError:true,content:[{type:"text",text:JSON.stringify({ok:false,error:{name:error?.constructor?.name||"Error",message:error instanceof Error?error.message:"Unknown error"}})}]};}
});
await server.connect(new StdioServerTransport());
