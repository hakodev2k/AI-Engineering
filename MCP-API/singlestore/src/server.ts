import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SingleStoreClient } from "./client.js";
import { buildTools } from "./tools.js";

const bool = (v:string|undefined,d=false)=>v === undefined ? d : v.toLowerCase() === "true";
const client = new SingleStoreClient({apiKey:process.env.SINGLESTORE_API_KEY ?? "",baseUrl:process.env.SINGLESTORE_API_BASE_URL,timeoutMs:Number(process.env.SINGLESTORE_TIMEOUT_MS ?? 15000)});
const policy = {approveWrites:bool(process.env.SINGLESTORE_APPROVE_WRITES),approveHighRisk:bool(process.env.SINGLESTORE_APPROVE_HIGH_RISK),allowDestructive:bool(process.env.SINGLESTORE_ALLOW_DESTRUCTIVE)};
const server = new McpServer({name:"singlestore-safe-connector",version:"1.0.0"});
for (const tool of buildTools(client, policy)) {
  server.tool(tool.name, tool.purpose, tool.schema.shape, async (input:any) => {
    try { const data = await tool.run(tool.schema.parse(input)); return {content:[{type:"text",text:JSON.stringify({ok:true,data,untrusted_provider_content:true})}]}; }
    catch (e:any) { return {isError:true,content:[{type:"text",text:JSON.stringify({ok:false,error:e?.message ?? "Unknown error"})}]}; }
  });
}
await server.connect(new StdioServerTransport());
