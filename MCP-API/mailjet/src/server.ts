import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { MailjetClient } from "./client.js";
import { buildTools } from "./tools.js";

export async function createServer(){
 const cfg=loadConfig(); const client=new MailjetClient(cfg); const server=new McpServer({name:"mailjet-connector",version:"1.0.0"});
 for(const t of buildTools(client,cfg)) server.tool(t.name,t.description,t.schema as any,async(args:any)=>{try{const data=await t.run(args);return{content:[{type:"text",text:JSON.stringify({data,untrustedProviderContent:true})}]};}catch(e){return{isError:true,content:[{type:"text",text:JSON.stringify({error:e instanceof Error?e.message:"Unknown error"})}]};}});
 return server;
}
if(import.meta.url===`file://${process.argv[1]}`){const server=await createServer();await server.connect(new StdioServerTransport());}
