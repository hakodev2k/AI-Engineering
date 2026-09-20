import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { connectUpstream } from "./upstream.js";
import { invoke, tools } from "./tools.js";

const upstream=await connectUpstream();
const server=new McpServer({name:"zeabur-safe-connector",version:"1.0.0"});
for(const def of tools){
 server.tool(def.name,def.description,def.schema,async(args)=>{
  try{const result=await invoke(def,args,upstream);return {content:[{type:"text",text:JSON.stringify(result)}]};}
  catch(error){return {isError:true,content:[{type:"text",text:error instanceof Error?error.message:"Unknown Zeabur connector error"}]};}
 });
}
const shutdown=async()=>{await upstream.close();process.exit(0)};
process.on("SIGINT",shutdown);process.on("SIGTERM",shutdown);
await server.connect(new StdioServerTransport());
