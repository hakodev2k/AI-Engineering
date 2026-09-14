import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ToolRouter, tools } from "./tools.js";
const server=new Server({name:"unleash-connector",version:"1.0.0"},{capabilities:{tools:{}}}); const router=new ToolRouter();
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:tools.map(({risk,...t})=>t)}));
server.setRequestHandler(CallToolRequestSchema,async r=>{try{const data=await router.execute(r.params.name,r.params.arguments||{});return{content:[{type:"text",text:JSON.stringify({ok:true,data,untrustedProviderData:true})}]};}catch(e:any){return{isError:true,content:[{type:"text",text:JSON.stringify({ok:false,error:{name:e?.constructor?.name||"Error",message:e instanceof Error?e.message:"Unknown error"}})}]};}});
await server.connect(new StdioServerTransport());
